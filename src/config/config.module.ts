import { config } from "dotenv";
config();

import { Module } from "@nestjs/common";
import { get } from "env-var";
import { AppConfig } from "./app.config";
import { DbConfig } from "./db.config";

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
    }],
    exports: [AppConfig, DbConfig]
})
export class ConfigModule {}