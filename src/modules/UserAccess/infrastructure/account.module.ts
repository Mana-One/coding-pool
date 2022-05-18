import { Module } from "@nestjs/common";
import { ConfigModule } from "../../../config/config.module";
import { AccountService } from "../application/account.service";
import { ACCOUNTS } from "../constants";
import { AccountsController } from "../exposition/accounts.controller";
import { AccountMapper } from "./account.mapper";
import { SequelizeAccounts } from "./accounts.sequelize";

@Module({
    imports: [ConfigModule],
    providers: [
        AccountService, 
        AccountMapper,
        {
            provide: ACCOUNTS,
            useClass: SequelizeAccounts
        }
    ],
    exports: [AccountService],
    controllers: [AccountsController]
})
export class AccountModule {}