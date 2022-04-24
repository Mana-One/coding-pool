import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { SequelizeModule } from "@nestjs/sequelize";
import { Dialect } from "sequelize/types";
import { ConfigModule } from "./config/config.module";
import { DbConfig } from "./config/db.config";
import { Neo4jModule } from "./infrastructure/neo4j/neo4j.module";
import { AccountModule } from "./modules/accounts/account.module";
import { AccountModel } from "./modules/accounts/infrastructure/account.model";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profiles/profile.module";
import { ProgramModel } from "./modules/Programs/infrastructure/program.model";
import { SocialModule } from "./modules/Social/infrastructure/social.module";

const persistence = [
    SequelizeModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (config: DbConfig) => ({
            dialect: config.DIALECT as Dialect,
            host: config.HOST,
            port: config.PORT,
            username: config.USER,
            password: config.PASSWORD,
            database: config.NAME,
            models: [AccountModel, ProgramModel],
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false
        }),
        inject: [DbConfig]
    }),
    Neo4jModule
];

const events = EventEmitterModule.forRoot(); 

const contexts = [
    AccountModule, 
    AuthModule,
    ProfileModule,
    SocialModule
];

@Module({
    imports: [
        ConfigModule, 
        events,
        ...contexts,
        ...persistence
    ]
})
export class AppModule {}