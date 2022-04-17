import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { Usecase } from "../../../../kernel/Usecase";
import { USER_STATS_DAO } from "../constants";
import { GetUserStatsQuery } from "../dtos/get-user-stats.query";
import { UserStats } from "../dtos/user-stats";
import { UserStatsDao } from "./user-stats.dao";

@Injectable()
export class GetUserStatsUsecase implements Usecase<GetUserStatsQuery, UserStats> {
    constructor(@Inject(USER_STATS_DAO) private readonly userStatsDao: UserStatsDao) {}

    async execute(input: GetUserStatsQuery): Promise<UserStats> {
        const id = UID.fromString(input.id, "Invalid user id.");
        if (E.isLeft(id)) {
            throw new BadRequestException(id.left.join("\n"));
        }
        const userStats = await this.userStatsDao.findById(id.right);
        if (O.isNone(userStats)) {
            throw new NotFoundException(`User with id '${id.right.value}' not found.`);
        }
        return userStats.value;
    }
}