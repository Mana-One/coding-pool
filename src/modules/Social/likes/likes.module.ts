import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { LIKES } from "./constants";
import { LikesController } from "./likes.controller";
import { LikesNeo4j } from "./likes.neo4j";
import { LikesService } from "./likes.service";

@Module({
    imports: [Neo4jModule],
    providers: [LikesService, {
        provide: LIKES,
        useFactory: (service: Neo4jService) => new LikesNeo4j(service),
        inject: [Neo4jService]
    }],
    controllers: [LikesController]
})
export class LikesModule {}