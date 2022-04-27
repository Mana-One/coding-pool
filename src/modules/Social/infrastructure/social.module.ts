import { Module } from "@nestjs/common";
import { CreatePublicationUsecase } from "../application/publications/create-publication/create-publication.usecase";
import { GetUserTimelineUsecase } from "../application/publications/get-user-timeline/get-user-timeline.usecase";
import { AccountCreatedListener } from "../application/users/account-created.listener";
import { GetUserUsecase } from "../application/users/get-user/get-user.usecase";
import { COMMENTS, PUBLICATIONS } from "../constants";
import { PublicationsController } from "../exposition/publications/publications.controller";
import { UsersController } from "../exposition/users/user.controller";
import { Neo4jPublications } from "./publications/neo4j.publications";
import { CreateCommentUsecase } from "../application/comments/create-comment/create-comment.usecase";
import { RemoveCommentUsecase } from "../application/comments/remove-comment/remove-comment.usecase";
import { Neo4jComments } from "./comments/neo4j.comments";
import { CommentsController } from "../exposition/comments/comments.controller";
import { ListCommentsUsecase } from "../application/comments/list-comments/list-comments.usecase";
import { AddLikeUsecase } from "../application/likes/add-like/add-like.usecase";
import { RemoveLikeUsecase } from "../application/likes/remove-like/remove-like.usecase";
import { LikesController } from "../exposition/likes/likes.controller";
import { FollowUserUsecase } from "../application/users/follow-user/follow-user.usecase";
import { UnfollowUserUsecase } from "../application/users/unfollow-user/unfollow-user.usecase";
import { ProgramCreatedListener } from "../application/users/program-created.listener";
import { GetHomeTimelineUsecase } from "../application/publications/get-home-timeline/get-home-timeline.usecase";
import { GetPublicationUsecase } from "../application/publications/get-publication/get-publication.usecase";
import { SearchUsersUsecase } from "../application/users/search-users/search-users.usecase";

const usersProviders = [
    GetUserUsecase, 
    AccountCreatedListener, 
    FollowUserUsecase, 
    UnfollowUserUsecase, 
    ProgramCreatedListener,
    SearchUsersUsecase
];
const publicationsProviders = [
    CreatePublicationUsecase,
    GetUserTimelineUsecase, 
    GetHomeTimelineUsecase, 
    GetPublicationUsecase, {
        provide: PUBLICATIONS,
        useClass: Neo4jPublications
}];
const commentsProviders = [
    CreateCommentUsecase,
    RemoveCommentUsecase, 
    ListCommentsUsecase, {
        provide: COMMENTS,
        useClass: Neo4jComments
}];
const likesProviders = [
    AddLikeUsecase,
    RemoveLikeUsecase
]

@Module({
    providers: [...usersProviders, ...publicationsProviders, ...commentsProviders, ...likesProviders],
    controllers: [UsersController, PublicationsController, CommentsController, LikesController]
})
export class SocialModule {}