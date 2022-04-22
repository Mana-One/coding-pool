import { Controller, Get, Req } from "@nestjs/common";
import { GetUserUsecase } from "../../application/users/get-user/get-user.usecase";

@Controller("users")
export class UsersController {
    constructor(private readonly getUserUsecase: GetUserUsecase) {}

    @Get("me")
    async getSelf(@Req() request) {
        return await this.getUserUsecase.execute({ userId: request.user.accountId });
    }
}