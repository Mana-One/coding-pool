import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { UserStats } from "../dtos/user-stats";
import { UserStatsDao } from "../application/user-stats.dao";
import { UserStatsModel } from "./user-stats.model";

@Injectable()
export class SequelizeUserStatsDao implements UserStatsDao {
    async create(userStats: UserStats): Promise<void> {
        await UserStatsModel.create(userStats)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
    }

    async findById(id: UID): Promise<Option<UserStats>> {
        const instance = await UserStatsModel.findByPk(id.value)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        if (instance === null) {
            return none;
        }
        return some(instance.toJSON());
    }

    async update(userStats: UserStats): Promise<void> {
        await UserStatsModel.update(userStats, { where: { id: userStats.id }})
            .catch(err => { throw new InternalServerErrorException(String(err)); });
    }
}