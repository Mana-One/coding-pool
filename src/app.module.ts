import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Dialect } from "sequelize/types";
import { ConfigModule } from "./config/config.module";
import { DbConfig } from "./config/db.config";
import { AccountModule } from "./usecases/accounts/account.module";
import { AccountModel } from "./usecases/accounts/infrastructure/account.model";
import { AuthModule } from "./usecases/auth/auth.module";
import { ProfileModule } from "./usecases/profiles/profile.module";

@Module({
    imports: [
        ConfigModule, 
        AccountModule, 
        AuthModule,
        ProfileModule,
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: DbConfig) => ({
                dialect: config.DIALECT as Dialect,
                host: config.HOST,
                port: config.PORT,
                username: config.USER,
                password: config.PASSWORD,
                database: config.NAME,
                models: [AccountModel],
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false
            }),
            inject: [DbConfig]
        })
    ]
})
export class AppModule {}