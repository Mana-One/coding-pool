import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../kernel/UID";
import { Likes } from "./likes.db";

@Injectable()
export class LikesNeo4j implements Likes {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(userId: UID, publicationId: UID): Promise<void> {
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User), (p:Publication) WHERE u.id = $userId AND p.id = $publicationId\n" +
            "MERGE (u)-[l:LIKED]->(p)",
            { userId: userId.value, publicationId: publicationId.value }
        )
        .catch(err => { throw new InternalServerErrorException(err instanceof Error ? err.message : String(err)); })
        .finally(() => session.close());
    }

    async remove(userId: UID, publicationId: UID): Promise<void> {
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User { id: $userId })-[l:LIKED]->(p:Publication { id: $publicationId })\n" +
            "DELETE l",
            { userId: userId.value, publicationId: publicationId.value }
        )
    }
}