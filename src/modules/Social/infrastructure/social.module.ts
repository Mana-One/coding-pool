import { Module } from "@nestjs/common";
import { CreatePublicationUsecase } from "../application/publications/create-publication/create-publication.usecase";
import { GetUserTimelineUsecase } from "../application/publications/get-user-timeline.usecase.ts/get-user-timeline.usecase";
import { AccountCreatedListener } from "../application/users/account-created.listener";
import { GetUserUsecase } from "../application/users/get-user/get-user.usecase";
import { CommentsModule } from "../comments/comments.module";
import { PUBLICATIONS } from "../constants";
import { PublicationsController } from "../exposition/publications/publications.controller";
import { UsersController } from "../exposition/users/user.controller";
import { PublicationsNeo4j } from "./publications/publications.neo4j";
import { LikesModule } from "../likes/likes.module";

const usersProviders = [GetUserUsecase, AccountCreatedListener];
const publicationProviders = [
    CreatePublicationUsecase,
    GetUserTimelineUsecase, {
        provide: PUBLICATIONS,
        useClass: PublicationsNeo4j
}]

@Module({
    imports: [CommentsModule, LikesModule],
    providers: [...usersProviders, ...publicationProviders],
    controllers: [UsersController, PublicationsController]
})
export class SocialModule {}