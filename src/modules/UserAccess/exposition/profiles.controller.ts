import { Controller, Get, Req } from "@nestjs/common";
import { ProfileService } from "../application/profile.service";

@Controller("accounts")
export class ProfilesController {
    constructor(private readonly service: ProfileService) {}

    @Get("me")
    async getMe(@Req() request) {
        return await this.service.getProfile(request.user.accountId);
    }
}