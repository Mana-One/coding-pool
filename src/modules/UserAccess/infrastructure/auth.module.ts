import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AppConfig } from "../../../config/app.config";
import { ConfigModule } from "../../../config/config.module";
import { AccountModule } from "./account.module";
import { AuthController } from "../exposition/auth.controller";
import { AuthService } from "../application/auth.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JwtStrategy } from "../auth/jwt.strategy";
import { LocalStrategy } from "../auth/local.strategy";

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