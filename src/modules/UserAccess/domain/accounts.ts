import { Option } from "fp-ts/lib/Option";
import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/uid";
import { Account } from "./account";

export interface Accounts extends Repository<UID, Account> {
    findByEmail(email: string): Promise<Option<Account>>;
    isUsernameUsed(username: string): Promise<boolean>;
}