import { Inject, Injectable } from "@nestjs/common";
import { Usecase } from "../../../../kernel/Usecase";
import { USER_STATS_DAO } from "../constants";
import { GetUserStatsQuery } from "../dtos/get-user-stats.query";
import { GetUserStatsUsecase } from "./get-user-stats.usecase";
import { UserStatsDao } from "./user-stats.dao";

@Injectable()
export class DecrementFollowersUsecase implements Usecase<GetUserStatsQuery, void> {
    constructor(
        @Inject(USER_STATS_DAO) private readonly userStatsDao: UserStatsDao,
        private readonly getUserStatsUsecase: GetUserStatsUsecase
    ) {}

        async execute(input: GetUserStatsQuery): Promise<void> {
            const userStats = await this.getUserStatsUsecase.execute(input);
            const count = userStats.followers - 1 < 0 ? 0 : userStats.followers - 1;
            await this.userStatsDao.update({
                ...userStats,
                followers: count
            });
        }
}