import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import * as neo4j from 'neo4j-driver';
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../../kernel/UID";
import { Publication } from "../../domain/publications/publication";
import { Publications } from "../../domain/publications/publications";

@Injectable()
export class PublicationsNeo4j implements Publications {
    constructor(private readonly neo4jService: Neo4jService) {}

    findById(id: UID): Promise<Option<Publication>> {
        throw new Error("Method not implemented.");
    }

    async save(entity: Publication): Promise<void> {
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User { id: $userId })\n" +
            "CREATE (u)-[pu:PUBLISHED]->(p:Publication { id: $id, content: $content, createdAt: $createdAt })",
            { userId: entity.postedBy.value, id: entity.id.value, content: entity.content, createdAt: neo4j.types.DateTime.fromStandardDate(entity.createdAt) }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());
    }
}