import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AppConfig } from "../../../config/app.config";
import { ConfigModule } from "../../../config/config.module";
import { AccountService } from "../application/account.service";
import { AuthService } from "../application/auth.service";
import { ProfileService } from "../application/profile.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JwtStrategy } from "../auth/jwt.strategy";
import { LocalStrategy } from "../auth/local.strategy";
import { ACCOUNTS } from "../constants";
import { AccountsController } from "../exposition/accounts.controller";
import { AuthController } from "../exposition/auth.controller";
import { ProfilesController } from "../exposition/profiles.controller";
import { AccountMapper } from "./account.mapper";
import { SequelizeAccounts } from "./accounts.sequelize";

const authProviders = [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    {
        provide: "APP_GUARD",
        useClass: JwtAuthGuard
    }
];
const accountProviders = [
    AccountService, 
    AccountMapper,
    {
        provide: ACCOUNTS,
        useClass: SequelizeAccounts
    }
];
const profileProviders = [ProfileService];

@Module({
    imports: [ 
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
    providers: [...authProviders, ...accountProviders, ...profileProviders],
    controllers: [AuthController, AccountsController, ProfilesController]
})
export class UserAccessModule {}