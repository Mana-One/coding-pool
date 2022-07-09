import { Injectable } from "@nestjs/common";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { Account } from "../domain/account";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Role } from "../domain/role";
import { AccountModel } from "./account.model";

@Injectable()
export class AccountMapper {
    async toPersistence(entity: Account) {
        const passwordToPersist = await entity.password.hash();
        return {
            id: entity.id.value,
            username: entity.username,
            email: entity.email.value,
            picture: O.toNullable(entity.picture),
            password: passwordToPersist.value,
            role: entity.role.name
        };
    }

    toDomain(instance: AccountModel): Account {
        return Account.of({
            id: UID.of(instance.id),
            username: instance.username,
            email: Email.of(instance.email),
            picture: O.fromNullable(instance.picture),
            password: Password.of(instance.password),
            role: Role.of(instance.role)
        });
    }
}