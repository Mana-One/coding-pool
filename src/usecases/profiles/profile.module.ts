import { Module } from "@nestjs/common";
import { PROFILES } from "./profile.constants";
import { ProfilesController } from "./profiles.controller";
import { SequelizeProfiles } from "./profiles.sequelize";

@Module({
    providers: [{
        provide: PROFILES,
        useClass: SequelizeProfiles
    }],
    controllers: [ProfilesController]
})
export class ProfileModule {}