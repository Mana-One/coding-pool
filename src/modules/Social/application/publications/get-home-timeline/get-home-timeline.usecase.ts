import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { int } from "neo4j-driver";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { Usecase } from "../../../../../kernel/Usecase";
import { GetUserTimelineQuery } from "../common/get-user-timeline.query";
import { PublicationDto, Timeline } from "../common/timeline";

@Injectable()
export class GetHomeTimelineUsecase implements Usecase<GetUserTimelineQuery, Timeline> {
    constructor(private readonly neo4jService: Neo4jService) {}
    
    async execute(request: GetUserTimelineQuery): Promise<Timeline> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const countResult = await transaction.run(
                "MATCH (:User { id: $userId })-[:FOLLOWS]->(:User)-[:PUBLISHED]->(publication:Publication)\n" +
                "RETURN COUNT(publication) as total", 
                { userId: request.userId }
            );
            const total = countResult.records[0].get("total").low;

            const rows = await transaction.run(
                "MATCH (:User { id: $userId })-[:FOLLOWS]->(followee:User)-[:PUBLISHED]->(publication:Publication)\n" +
                "RETURN followee, publication\n" + 
                "ORDER BY publication.createdAt DESC\n" + 
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
            id: data.get("publication").properties.id,
            content: data.get("publication").properties.content,
            createdAt: Neo4jService.parseDate(data.get("publication").properties.createdAt),
            author: {
                id: data.get("followee").properties.id,
                username: data.get("followee").properties.username
            }
        };
    }
}