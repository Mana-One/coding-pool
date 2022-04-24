import { Global, Module } from "@nestjs/common";
import { DbConfig } from "../../config/db.config";
import { SequelizeService } from "./sequelize.service";

@Global()
@Module({
    providers: [{
        provide: SequelizeService,
        useFactory: (config: DbConfig) => SequelizeService.init(config.URL),
        inject: [DbConfig]
    }],
    exports: [SequelizeService]
})
export class SequelizeModule {}