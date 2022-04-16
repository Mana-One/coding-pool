import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import * as neo4j from "neo4j-driver";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../kernel/UID";
import { Publication } from "./publication.entity";
import { Publications } from "./publications";

@Injectable()
export class PublicationsNeo4j implements Publications {
    constructor(private readonly neo4jService: Neo4jService) {}

    findById(id: UID): Promise<Option<Publication>> {
        throw new Error("Method not implemented.");
    }

    async save(entity: Publication): Promise<void> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            await transaction.run(
                "CREATE (p:Publication { id: $id, content: $content, createdAt: $createdAt })", 
                { id: entity.id.value, content: entity.content, createdAt: neo4j.types.DateTime.fromStandardDate(entity.createdAt) }
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