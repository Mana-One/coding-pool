import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { USERS } from "./constants";
import { UserListener } from "./user.listener";
import { UserService } from "./user.service";
import { UsersNeo4j } from "./users.neo4j";

const neo4jProvider = {
    provide: USERS,
    useFactory: (service: Neo4jService) => new UsersNeo4j(service),
    inject: [Neo4jService]
}

@Module({
    imports: [Neo4jModule],
    providers: [UserService, UserListener, neo4jProvider]
})
export class UsersModule {}