import { Option } from "fp-ts/lib/Option";
import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/UID";
import { Account } from "./account.entity";

export interface Accounts extends Repository<UID, Account> {
    findByEmail(email: string): Promise<Option<Account>>;
    isUsernameUsed(username: string): Promise<boolean>;
}