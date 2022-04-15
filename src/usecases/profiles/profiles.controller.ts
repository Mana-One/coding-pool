import { Controller, Get, Inject, NotFoundException, Req } from "@nestjs/common";
import { isNone } from "fp-ts/lib/Option";
import { PROFILES } from "./profile.constants";
import { Profiles } from "./profiles";

@Controller("accounts")
export class ProfilesController {
    constructor(
        @Inject(PROFILES)
        private readonly profiles: Profiles
    ) {}

    @Get("me")
    async getMe(@Req() request) {
        const profile = await this.profiles.findById(request.user.accountId);
        if (isNone(profile)) {
            throw new NotFoundException("Profile not found.");
        }
        return profile.value;
    }
}