import { Controller, Get, Param, Req } from "@nestjs/common";
import { GetUserStatsUsecase } from "../application/get-user-stats.usecase";

@Controller("users")
export class UserStatsController {
    constructor(private readonly getUserStatsUsecase: GetUserStatsUsecase) {}

    @Get("me")
    async getOwnStats(@Req() request) {
        return await this.getUserStatsUsecase.execute({ id: request.user.accountId });
    }

    @Get(":id")
    async getUserStats(@Param("id") id: string) {
        return await this.getUserStatsUsecase.execute({ id });
    }
}