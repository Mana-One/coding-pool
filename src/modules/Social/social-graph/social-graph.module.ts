import { Module } from "@nestjs/common";
import { Neo4jModule } from "../../../infrastructure/neo4j/neo4j.module";
import { AddUserUsecase } from "./application/add-user.usecase";
import { SOCIAL_GRAPH_DAO } from "./constants";
import { FollowUserUsecase } from "./application/follow-user.usecase";
import { Neo4jSocialGraphDao } from "./infrastructure/neo4j.social-graph.dao";
import { SocialGraphController } from "./exposition/social-graph.controller";
import { SocialGraphListener } from "./application/social-graph.listener";

@Module({
    imports: [Neo4jModule],
    providers: [
        FollowUserUsecase,
        AddUserUsecase,
        SocialGraphListener, {
        provide: SOCIAL_GRAPH_DAO,
        useClass: Neo4jSocialGraphDao
    }],
    controllers: [SocialGraphController]
})
export class SocialGraphModule {}