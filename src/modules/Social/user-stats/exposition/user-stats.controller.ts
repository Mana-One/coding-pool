import { Controller, Get, Param, Req } from "@nestjs/common";
import { Public } from "../../../auth/public.decorator";
import { GetUserStatsUsecase } from "../application/get-user-stats.usecase";

@Controller("users")
export class UserStatsController {
    constructor(private readonly getUserStatsUsecase: GetUserStatsUsecase) {}

    @Get("me")
    async getOwnStats(@Req() request) {
        return await this.getUserStatsUsecase.execute({ id: request.user.accountId });
    }

    @Public()
    @Get(":id")
    async getUserStats(@Param("id") id: string) {
        return await this.getUserStatsUsecase.execute({ id });
    }
}