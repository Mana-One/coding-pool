import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "./config/config.module";
import { Neo4jModule } from "./infrastructure/neo4j/neo4j.module";
import { SequelizeModule } from "./infrastructure/sequelize/sequelize.module";
import { AccountModule } from "./modules/accounts/account.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profiles/profile.module";
import { SocialModule } from "./modules/Social/social.module";

const persistence = [
    SequelizeModule,
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