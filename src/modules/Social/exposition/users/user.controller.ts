import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { Public } from "../../../auth/public.decorator";
import { FollowUserUsecase } from "../../application/users/follow-user/follow-user.usecase";
import { GetUserUsecase } from "../../application/users/get-user/get-user.usecase";
import { UnfollowUserUsecase } from "../../application/users/unfollow-user/unfollow-user.usecase";

@Controller("users")
export class UsersController {
    constructor(
        private readonly getUserUsecase: GetUserUsecase,
        private readonly followUserUsecase: FollowUserUsecase,
        private readonly unfollowUserUsecase: UnfollowUserUsecase
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
        return await this.getUserUsecase.execute({ userId: request.user.accountId });
    }

    @Public()
    @Get(":userId")
    async getUser(@Param("userId") userId: string) {
        return await this.getUserUsecase.execute({ userId });
    }
}