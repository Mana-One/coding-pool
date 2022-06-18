import { Controller, Delete, Get, Param, Post, Query, Req } from "@nestjs/common";
import { AppConfig } from "../../../../config/app.config";
import { PageResponse } from "../../../../kernel/PageResponse";
import { FollowUserUsecase } from "../../application/users/follow-user/follow-user.usecase";
import { GetUserUsecase } from "../../application/users/get-user/get-user.usecase";
import { SearchUsersUsecase } from "../../application/users/search-users/search-users.usecase";
import { UnfollowUserUsecase } from "../../application/users/unfollow-user/unfollow-user.usecase";
import { SearchUsersRequest } from "./search-users.request";

@Controller("users")
export class UsersController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly getUserUsecase: GetUserUsecase,
        private readonly followUserUsecase: FollowUserUsecase,
        private readonly unfollowUserUsecase: UnfollowUserUsecase,
        private readonly searchUsersUsecase: SearchUsersUsecase
    ) {}

    @Post("follow/:followee")
    async follow(
        @Req() request,
        @Param("followee") followee: string
    ) {
        await this.followUserUsecase.execute({
            followee,
            follower: request.user.accountId
        });
    }

    @Delete("unfollow/:followee")
    async unfollow(
        @Req() request,
        @Param("followee") followee: string
    ) {
        await this.unfollowUserUsecase.execute({
            followee,
            follower: request.user.accountId
        });
    }

    @Get("me")
    async getSelf(@Req() request) {
        return await this.getUserUsecase.execute({ 
            userId: request.user.accountId,
            callerId: request.user.accountId
        });
    }

    @Get("search")
    async searchUsers(
        @Req() request,
        @Query() query: SearchUsersRequest
    ) {
        const page = await this.searchUsersUsecase.execute(query);
        const url = new URL(request.baseUrl + request.path, this.appConfig.HOST);
        url.searchParams.set("username", query.username);
        return new PageResponse(page, url);
    }

    @Get(":userId")
    async getUser(
        @Req() request, 
        @Param("userId") userId: string
    ) {
        return await this.getUserUsecase.execute({ 
            userId,
            callerId: request.user.accountId
        });
    }
}