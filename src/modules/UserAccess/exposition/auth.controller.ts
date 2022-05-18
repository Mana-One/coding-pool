import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { LocalAuthGuard } from "../auth/local-auth.guard";
import { Public } from "../../../kernel/public.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req) {
        const access_token = await this.authService.login(req.user);
        return { access_token }
    }
}