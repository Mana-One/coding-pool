import { Repository } from "../../../../kernel/Repository";
import { UID } from "../../../../kernel/uid";
import { User } from "./user";

export interface Users extends Repository<UID, User> {}