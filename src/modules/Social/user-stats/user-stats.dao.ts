import { Option } from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { UserStats } from "./user-stats";

export interface UserStatsDao {
    create(userStats: UserStats): Promise<void>;
    findById(id: UID): Promise<Option<UserStats>>;
}