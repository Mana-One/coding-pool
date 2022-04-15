import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import * as neo4j from "neo4j-driver";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../kernel/UID";
import { User } from "./user.entity";
import { Users } from "./users";

@Injectable()
export class UsersNeo4j implements Users {
    constructor(private readonly neo4jService: Neo4jService) {}

    findById(id: UID): Promise<Option<User>> {
        throw new Error("Method not implemented.");
    }

    async save(entity: User): Promise<void> {
        const session = this.neo4jService.startSession();
        const result = await session.run(
            'MERGE (u:Publisher:User { id: $id, username: $username, memberSince: $memberSince }) RETURN u',
            { id: entity.id.value, username: entity.username, memberSince: neo4j.types.DateTime.fromStandardDate(entity.memberSince) }
        )
        .catch(err => { throw new InternalServerErrorException(err instanceof Error ? err.message : String(err)); })
        .finally(async () => await session.close());
    }
}