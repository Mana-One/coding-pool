import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "./config/config.module";
import { Neo4jModule } from "./infrastructure/neo4j/neo4j.module";
import { SequelizeModule } from "./infrastructure/sequelize/sequelize.module";
import { ProgramsModule } from "./modules/Programs/infrastructure/programs.module";
import { SocialModule } from "./modules/Social/infrastructure/social.module";
import { UserAccessModule } from "./modules/UserAccess/infrastructure/user-access.module";

const persistence = [
    SequelizeModule,
    Neo4jModule
];

const events = EventEmitterModule.forRoot(); 

const contexts = [
    UserAccessModule,
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