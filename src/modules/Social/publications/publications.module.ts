import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { PUBLICATIONS } from "./constants";
import { PublicationService } from "./publication.service";
import { PublicationsController } from "./publications.controller";
import { PublicationsNeo4j } from "./publications.neo4j";

@Module({
    imports: [Neo4jModule],
    providers: [PublicationService, {
        provide: PUBLICATIONS,
        useClass: PublicationsNeo4j
    }],
    controllers: [PublicationsController]
})
export class PublicationsModule {}