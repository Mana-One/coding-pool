import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { UserStats } from "./user-stats";
import { UserStatsDao } from "./user-stats.dao";
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
}