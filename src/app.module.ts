import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { S3Module } from "nestjs-s3";
import { ConfigModule } from "./config/config.module";
import { S3Config } from "./config/s3.config";
import { Neo4jModule } from "./infrastructure/neo4j/neo4j.module";
import { SequelizeModule } from "./infrastructure/sequelize/sequelize.module";
import { CompetitiveModeModule } from "./modules/CompetitiveMode/infrastructure/competitive-mode.module";
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
    ProgramsModule,
    CompetitiveModeModule
];

@Module({
    imports: [
        ConfigModule, 
        events,
        S3Module.forRootAsync({
            useFactory: (conf: S3Config) => ({
                config: {
                    accessKeyId: conf.ACCESS_KEY,
                    secretAccessKey: conf.SECRET_KEY,
                    endpoint: conf.ENDPOINT,
                    s3ForcePathStyle: true,
                    signatureVersion: "v4",
                }
            }),
            inject: [S3Config]
        }),
        ...contexts,
        ...persistence
    ]
})
export class AppModule {}