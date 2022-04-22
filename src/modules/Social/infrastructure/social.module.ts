import { Module } from "@nestjs/common";
import { CreatePublicationUsecase } from "../application/publications/create-publication/create-publication.usecase";
import { GetUserTimelineUsecase } from "../application/publications/get-user-timeline.usecase.ts/get-user-timeline.usecase";
import { AccountCreatedListener } from "../application/users/account-created.listener";
import { GetUserUsecase } from "../application/users/get-user/get-user.usecase";
import { COMMENTS, PUBLICATIONS } from "../constants";
import { PublicationsController } from "../exposition/publications/publications.controller";
import { UsersController } from "../exposition/users/user.controller";
import { Neo4jPublications } from "./publications/neo4j.publications";
import { LikesModule } from "../likes/likes.module";
import { CreateCommentUsecase } from "../application/comments/create-comment.usecase.ts/create-comment.usecase";
import { RemoveCommentUsecase } from "../application/comments/remove-comment/remove-comment.usecase";
import { Neo4jComments } from "./comments/neo4j.comments";
import { CommentsController } from "../exposition/comments/comments.controller";

const usersProviders = [GetUserUsecase, AccountCreatedListener];
const publicationsProviders = [
    CreatePublicationUsecase,
    GetUserTimelineUsecase, {
        provide: PUBLICATIONS,
        useClass: Neo4jPublications
}];
const commentsProvider = [
    CreateCommentUsecase,
    RemoveCommentUsecase, {
        provide: COMMENTS,
        useClass: Neo4jComments
}];

@Module({
    imports: [LikesModule],
    providers: [...usersProviders, ...publicationsProviders, ...commentsProvider],
    controllers: [UsersController, PublicationsController, CommentsController]
})
export class SocialModule {}