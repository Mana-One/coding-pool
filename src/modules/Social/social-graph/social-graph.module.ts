import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { SOCIAL_GRAPH_DAO } from "./constants";
import { FollowUserUsecase } from "./follow-user.usecase";
import { Neo4jSocialGraphDao } from "./neo4j.social-graph.dao";
import { SocialGraphController } from "./social-graph.controller";

@Module({
    imports: [Neo4jModule],
    providers: [FollowUserUsecase, {
        provide: SOCIAL_GRAPH_DAO,
        useClass: Neo4jSocialGraphDao
    }],
    controllers: [SocialGraphController]
})
export class SocialGraphModule {}