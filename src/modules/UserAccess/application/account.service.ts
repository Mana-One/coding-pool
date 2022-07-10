import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import * as O from "fp-ts/lib/Option";
import { cumulativeValidation } from "../../../kernel/fp-utils";
import { StringUtils } from "../../../kernel/string-utils";
import { UID } from "../../../kernel/uid";
import { AccountCreated } from "../../shared-kernel/account-created.event";
import { AccountModified } from "../../shared-kernel/account-modified.event";
import { ACCOUNT_CREATED_EVENT, ACCOUNT_MODIFIED_EVENT } from "../../shared-kernel/constants";
import { ACCOUNTS } from "../constants";
import { Account } from "../domain/account";
import { Accounts } from "../domain/accounts";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Role } from "../domain/role";

@Injectable()
export class AccountService {
    constructor(
        @Inject(ACCOUNTS) private readonly accounts: Accounts,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async changePassword(id: string, oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
        const account = await this.retrieveAccount(id);
        if (!await account.password.compareWithClear(oldPassword) ||
            newPassword !== confirmPassword) {
            throw new BadRequestException("Old password not matching, or new password and confirmation not matching.");
        }
        const password = Password.fromClear(newPassword);
        if (E.isLeft(password)) {
            throw new BadRequestException("Invalid new password.");
        }
        account.changePassword(password.right);
        await this.accounts.save(account);
    }

    async edit(id: string, username: string, email: string, picture: string | null): Promise<void> {
        const account = await this.retrieveAccount(id);
        const result = pipe(
            sequenceS(cumulativeValidation)({
                username: this.checkUsername(username),
                email: Email.create(email),
                picture: E.of(O.fromNullable(picture))
            }),
            E.map(props => account.editAccount(props))
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        await this.accounts.save(account);

        if (account.role.equals(Role.ADMIN)) { return; }

        this.eventEmitter.emit(
            ACCOUNT_MODIFIED_EVENT, 
            new AccountModified(
                account.id.value, 
                account.username, 
                account.email.value, 
                O.toNullable(account.picture)
            )
        );
    }

    async findOne(email: string): Promise<Account> {
        const account = await this.accounts.findByEmail(email);
        if (O.isNone(account)) {
            throw new NotFoundException("Account not found.");
        }
        return account.value;
    }

    async isUsernameUsed(username: string): Promise<boolean> {
        return this.accounts.isUsernameUsed(username);
    }

    async register(
        username: string, 
        email: string, 
        picture: string | null, 
        password: string
    ): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                username: this.checkUsername(username),
                email: Email.create(email),
                picture: E.of(O.fromNullable(picture)),
                password: Password.fromClear(password)
            }),
            E.map(props => Account.createUser(props))
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        const account = result.right;
        await this.accounts.save(account);
        this.eventEmitter.emit(ACCOUNT_CREATED_EVENT, new AccountCreated(
            account.id.value, 
            account.username,
            O.toNullable(account.picture)
        ));
    }

    async registerAdmin(
        username: string, 
        email: string, 
        picture: string | null,
        password: string
    ): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                username: this.checkUsername(username),
                email: Email.create(email),
                picture: E.of(O.fromNullable(picture)),
                password: Password.fromClear(password)
            }),
            E.map(props => Account.createAdmin(props))
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        const account = result.right;
        await this.accounts.save(account);
    }



    private async retrieveAccount(id: string): Promise<Account> {
        const accountId = UID.fromString(id, "Invalid account id.");
        if (E.isLeft(accountId)) {
            throw new BadRequestException(accountId.left[0]);
        }
        const account = await this.accounts.findById(accountId.right);
        if (O.isNone(account)) {
            throw new NotFoundException("Account not found.");
        }
        return account.value;
    }

    private checkUsername(username: string): E.Either<NonEmptyArray<string>, string> {
        return StringUtils.minLength(1, "Username is empty")(username);
    }
}