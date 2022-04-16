import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import { DateTime, int } from 'neo4j-driver';
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../../kernel/UID";
import { Publication } from "../domain/publication";
import { Publications } from "../domain/publications";
import { PublicationDto, Timeline } from "../dtos/timeline";

@Injectable()
export class PublicationsNeo4j implements Publications {
    constructor(private readonly neo4jService: Neo4jService) {}

    findById(id: UID): Promise<Option<Publication>> {
        throw new Error("Method not implemented.");
    }

    async listByUser(userId: UID, limit: number, offset: number): Promise<Timeline> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const countResult = await transaction.run(
                "MATCH (u:User { id: $userId })-[pu:PUBLISHED]->(p:Publication)\n" +
                "RETURN COUNT(p) as total", 
                { userId: userId.value }
            );
            const total = countResult.records[0].get("total").low;

            const rows = await transaction.run(
                "MATCH (u:User { id: $userId })-[pu:PUBLISHED]->(p:Publication)\n" +
                "RETURN p, u\n" + 
                "ORDER BY p.createdAt DESC\n" + 
                "SKIP $offset LIMIT $limit",
                { userId: userId.value, limit: int(limit), offset: int(offset) }
            );

            const data = rows.records.map(r => toDto(r));
            await transaction.commit();

            return new Timeline(data, total, limit, offset);

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

    async save(entity: Publication): Promise<void> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            await transaction.run(
                "CREATE (p:Publication { id: $id, content: $content, createdAt: $createdAt })", 
                { id: entity.id.value, content: entity.content, createdAt: DateTime.fromStandardDate(entity.createdAt) }
            );

            await transaction.run(
                "MATCH (u:User), (p:Publication) WHERE u.id = $userId AND p.id = $id " +
                "CREATE (u)-[pu:PUBLISHED]->(p)",
                { userId: entity.postedBy.value, id: entity.id.value }
            );

            await transaction.commit();

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
}


function toDto(data: any): PublicationDto {
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