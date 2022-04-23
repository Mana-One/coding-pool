import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { int } from "neo4j-driver";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { CommentDto, CommentList } from "./comment-list";
import { ListCommentsQuery } from "./list-comments.query";

@Injectable()
export class ListCommentsUsecase {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: ListCommentsQuery): Promise<CommentList> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const countResult = await transaction.run(
                "MATCH (c:Comment)-[:IS_ATTACHED_TO]->(p:Publication { id: $publicationId })\n" +
                "RETURN COUNT(p) as total", 
                { publicationId: request.publicationId }
            );
            const total = countResult.records[0].get("total").low;

            const rows = await transaction.run(
                "MATCH (u:User)-[:COMMENTED]->(c:Comment)-[:IS_ATTACHED_TO]->(p:Publication { id: $publicationId })\n" +
                "RETURN c, u\n" + 
                "ORDER BY c.createdAt DESC\n" + 
                "SKIP $offset LIMIT $limit",
                { publicationId: request.publicationId, limit: int(request.limit), offset: int(request.offset) }
            );
            await transaction.commit();

            const data = rows.records.map(r => this.toDto(r));
            return new CommentList(data, total, request.limit, request.offset);

        } catch(err) {
            await transaction.rollback();
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }

    private toDto(data: any): CommentDto {
        const user = data.get("u");
        const comment = data.get("c");
        return {
            id: comment.properties.id,
            content: comment.properties.content,
            createdAt: Neo4jService.parseDate(comment.properties.createdAt),
            leftBy: {
                id: user.properties.id,
                username: user.properties.username
            }
        };
    }
}