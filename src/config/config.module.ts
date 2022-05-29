import { config } from "dotenv";
config();

import { Global, Module } from "@nestjs/common";
import { get } from "env-var";
import { AppConfig } from "./app.config";
import { DbConfig } from "./db.config";
import { Neo4jConfig } from "./neo4j.config";
import { Judge0Config } from "./judge0.config";

@Global()
@Module({
    providers: [{
        provide: AppConfig,
        useValue: new AppConfig(
            get("PORT").required().asPortNumber(),
            get("JWT_SECRET").required().asString(),
            get("HOST").required().asUrlString()
        )
    }, {
        provide: DbConfig,
        useValue: new DbConfig(
            get("DATABASE_URL").required().asUrlString(),
            get("DB_DIALECT").required().asString()
        )
    }, {
        provide: Neo4jConfig,
        useValue: new Neo4jConfig(
            get("NEO4J_URL").required().asUrlString(),
            get("NEO4J_USER").required().asString(),
            get("NEO4J_PASSWORD").required().asString()
        )
    }, {
        provide: Judge0Config,
        useValue: new Judge0Config(get("JUDGE0_URL").required().asUrlString())
    }],
    exports: [AppConfig, DbConfig, Neo4jConfig]
})
export class ConfigModule {}