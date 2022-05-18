import { Injectable } from "@nestjs/common";
import { pipe } from "fp-ts/lib/function";
import { map, none, some, toNullable } from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { Account } from "../domain/account";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Role } from "../domain/role";
import { Wallet } from "../domain/wallet";
import { AccountModel } from "./account.model";

@Injectable()
export class AccountMapper {
    async toPersistence(entity: Account) {
        const passwordToPersist = await entity.password.hash();
        return {
            id: entity.id.value,
            username: entity.username,
            wallet: pipe(
                entity.wallet,
                map((w: Wallet) => w.value),
                toNullable
            ),
            email: entity.email.value,
            password: passwordToPersist.value,
            role: entity.role.name
        };
    }

    toDomain(instance: AccountModel): Account {
        return Account.of({
            id: UID.of(instance.id),
            username: instance.username,
            wallet: instance.wallet === null ? none : some(Wallet.of(instance.wallet)),
            email: Email.of(instance.email),
            password: Password.of(instance.password),
            role: Role.of(instance.role)
        });
    }
}