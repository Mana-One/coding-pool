import { Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { FollowUserUsecase } from "../application/follow-user.usecase";
import { UnfollowUserUsecase } from "../application/unfollow-user.usecase";

@Controller("social")
export class SocialGraphController {
    constructor(
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
        })
    }
}