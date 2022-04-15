import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AppConfig } from "../../config/app.config";
import { ConfigModule } from "../../config/config.module";
import { AccountModule } from "../accounts/account.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        ConfigModule,
        AccountModule, 
        PassportModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (appConfig: AppConfig) => ({
                secret: appConfig.JWT_SECRET,
                signOptions: {
                    expiresIn: "10h"
                }
            }),
            inject: [AppConfig]
        })
    ],
    providers: [
        AuthService, 
        LocalStrategy, 
        JwtStrategy,
        {
            provide: "APP_GUARD",
            useClass: JwtAuthGuard
        }
    ],
    controllers: [AuthController]
})
export class AuthModule {}