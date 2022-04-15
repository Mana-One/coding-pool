import { config } from "dotenv";
config();

import { Global, Module } from "@nestjs/common";
import { get } from "env-var";
import { AppConfig } from "./app.config";
import { DbConfig } from "./db.config";
import { Neo4jConfig } from "./neo4j.config";

@Global()
@Module({
    providers: [{
        provide: AppConfig,
        useValue: new AppConfig(
            get("PORT").required().asPortNumber(),
            get("JWT_SECRET").required().asString()
        )
    }, {
        provide: DbConfig,
        useValue: new DbConfig(
            get("DB_DIALECT").required().asString(),
            get("DB_HOST").required().asString(),
            get("DB_USER").required().asString(),
            get("DB_PASSWORD").required().asString(),
            get("DB_NAME").required().asString(),
            get("DB_PORT").required().asPortNumber()
        )
    }, {
        provide: Neo4jConfig,
        useFactory: () => new Neo4jConfig(
            get("NEO4J_URL").required().asUrlString(),
            get("NEO4J_USER").required().asString(),
            get("NEO4J_PASSWORD").required().asString()
        )
    }],
    exports: [AppConfig, DbConfig, Neo4jConfig]
})
export class ConfigModule {}