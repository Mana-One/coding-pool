import { Module } from "@nestjs/common";
import { CreateUserStatsUsecase } from "./application/create-user-stats.usecase";
import { GetUserStatsUsecase } from "./application/get-user-stats.usecase";
import { UserStatsListener } from "./application/user-stats.listener";
import { USER_STATS_DAO } from "./constants";
import { UserStatsController } from "./exposition/user-stats.controller";
import { SequelizeUserStatsDao } from "./infrastructure/sequelize.user-stats.dao";

@Module({
    providers: [
        CreateUserStatsUsecase, 
        GetUserStatsUsecase, 
        UserStatsListener, {
            provide: USER_STATS_DAO,
            useClass: SequelizeUserStatsDao
    }],
    controllers: [UserStatsController]
})
export class UserStatsModule {}