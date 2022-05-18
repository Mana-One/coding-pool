import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import { Public } from "../../../kernel/public.decorator";
import { Roles } from "../../../kernel/roles.decorator";
import { AccountService } from "../application/account.service";
import { ChangePasswordRequest } from "./ChangePasswordRequest";
import { CreateUserRequest } from "./CreateUserRequest";
import { EditAccountRequest } from "./EditAccountRequest";

@Controller("accounts")
export class AccountsController {
    constructor(private readonly service: AccountService) {}

    @Public()
    @Get("/check-username/:username")
    async isUsernameUsed(@Param("username") username: string) {
        const isUsernameUsed = await this.service.isUsernameUsed(username);
        return { isUsernameUsed };
    }

    @Public()
    @Post("register")
    async register(@Body() body: CreateUserRequest) {
        await this.service.register(body.username, body.email, body.password);
    }

    @Roles("admin")
    @Post("register/admin")
    async registerAdmin(@Body() body: CreateUserRequest) {
        await this.service.registerAdmin(body.username, body.email, body.password);
    }

    @Put("me/password")
    async changePassword(
        @Req() request,
        @Body() body: ChangePasswordRequest
    ) {
        await this.service.changePassword(request.user.accountId, body.oldPassword, body.newPassword, body.confirmPassword);
    }

    @Put("me")
    async edit(
        @Req() request,
        @Body() body: EditAccountRequest
    ) {
        await this.service.edit(request.user.accountId, body.username, body.wallet, body.email);
    }
}