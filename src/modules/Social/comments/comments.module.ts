import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { CommentsController } from "./comments.controller";
import { CommentsNeo4j } from "./comments.neo4j";
import { CommentsService } from "./comments.service";
import { COMMENTS } from "./constants";

@Module({
    imports: [Neo4jModule],
    providers: [CommentsService, {
        provide: COMMENTS,
        useClass: CommentsNeo4j
    }],
    controllers: [CommentsController]
})
export class CommentsModule {}