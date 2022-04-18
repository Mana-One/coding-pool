import { Module } from "@nestjs/common";
import { DbConfig } from "../../config/db.config";
import { SequelizeService } from "./sequelize.service";

@Module({
    providers: [{
        provide: SequelizeService,
        inject: [DbConfig],
        useFactory: (config: DbConfig) => SequelizeService.init(config.URL)
    }],
    exports: [SequelizeService]
})
export class SequelizeModule {}