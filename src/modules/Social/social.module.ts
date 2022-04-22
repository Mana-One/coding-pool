import { Module } from "@nestjs/common";
import { AccountCreatedListener } from "./application/users/account-created.listener";
import { GetUserUsecase } from "./application/users/get-user/get-user.usecase";
import { CommentsModule } from "./comments/comments.module";
import { UsersController } from "./exposition/users/user.controller";
import { LikesModule } from "./likes/likes.module";
import { PublicationsModule } from "./publications/publications.module";

const usersProviders = [GetUserUsecase, AccountCreatedListener];

@Module({
    imports: [PublicationsModule, CommentsModule, LikesModule],
    providers: [...usersProviders],
    controllers: [UsersController]
})
export class SocialModule {}