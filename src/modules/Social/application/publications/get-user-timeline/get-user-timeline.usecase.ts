import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { int } from "neo4j-driver";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { PublicationDto, Timeline } from "../common/timeline";
import { GetUserTimelineQuery } from "../common/get-user-timeline.query";

@Injectable()
export class GetUserTimelineUsecase {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: GetUserTimelineQuery): Promise<Timeline> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const countResult = await transaction.run(
                "MATCH (u:User { id: $userId })-[:PUBLISHED]->(p:Publication)\n" +
                "RETURN COUNT(p) as total", 
                { userId: request.userId }
            );
            const total = countResult.records[0].get("total").low;

            const rows = await transaction.run(
                "MATCH (u:User { id: $userId })-[pu:PUBLISHED]->(p:Publication)\n" +
                "RETURN p, u\n" + 
                "ORDER BY p.createdAt DESC\n" + 
                "SKIP $offset LIMIT $limit",
                { userId: request.userId, limit: int(request.limit), offset: int(request.offset) }
            );

            const data = rows.records.map(r => this.toDto(r));
            await transaction.commit();

            return new Timeline(data, total, request.limit, request.offset);

        } catch(err) {
            await transaction.rollback();
            if (err instanceof HttpException) {
                throw err;
            }
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }

    private toDto(data: any): PublicationDto {
        return {
            id: data.get("p").properties.id,
            content: data.get("p").properties.content,
            createdAt: Neo4jService.parseDate(data.get("p").properties.createdAt),
            author: {
                id: data.get("u").properties.id,
                username: data.get("u").properties.username
            }
        };
    }
}