import { Controller, Param, Post, Req } from "@nestjs/common";
import { request } from "http";
import { FollowUserUsecase } from "../application/follow-user.usecase";

@Controller("social")
export class SocialGraphController {
    constructor(private readonly followUserUsecase: FollowUserUsecase) {}

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
}