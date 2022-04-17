import { Inject, Injectable } from "@nestjs/common";
import { Usecase } from "../../../kernel/Usecase";
import { USER_STATS_DAO } from "./constants";
import { CreateUserStatsCommand } from "./create-user-stats.command";
import { UserStatsDao } from "./user-stats.dao";

@Injectable()
export class CreateUserStatsUsecase implements Usecase<CreateUserStatsCommand, void> {
    constructor(@Inject(USER_STATS_DAO) private readonly userStatsDao: UserStatsDao) {}

    async execute(input: CreateUserStatsCommand): Promise<void> {
        await this.userStatsDao.create({
            ...input,
            followers: 0,
            following: 0,
            programs: 0,
            competitions_entered: 0,
            competitions_won: 0
        });
    }
}