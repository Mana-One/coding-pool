import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "./config/config.module";
import { Neo4jModule } from "./infrastructure/neo4j/neo4j.module";
import { SequelizeModule } from "./infrastructure/sequelize/sequelize.module";
import { AccountModule } from "./modules/UserAccess/infrastructure/account.module";
import { AuthModule } from "./modules/UserAccess/infrastructure/auth.module";
import { ProfileModule } from "./modules/profiles/profile.module";
import { ProgramsModule } from "./modules/Programs/infrastructure/programs.module";
import { SocialModule } from "./modules/Social/infrastructure/social.module";

const persistence = [
    SequelizeModule,
    Neo4jModule
];

const events = EventEmitterModule.forRoot(); 

const contexts = [
    AccountModule, 
    AuthModule,
    ProfileModule,
    SocialModule,
    ProgramsModule
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