import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { sequenceS } from "fp-ts/lib/Apply";
import { Either, isLeft, map, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { isNone, none, Option, some } from "fp-ts/lib/Option";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";
import { ACCOUNT_CREATED_EVENT } from "../../shared-kernel/constants";
import { ACCOUNTS } from "../constants";
import { Account } from "../domain/account.entity";
import { Accounts } from "../domain/accounts";
import { Email } from "../domain/email";
import { Password } from "../domain/password";
import { Wallet } from "../domain/wallet";

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
        if (isLeft(password)) {
            throw new BadRequestException("Invalid new password.");
        }
        account.changePassword(password.right);
        await this.accounts.save(account);
    }

    async edit(id: string, username: string, wallet: string | null, email: string): Promise<void> {
        const account = await this.retrieveAccount(id);
        const result = pipe(
            sequenceS(cumulativeValidation)({
                username: this.checkUsername(username),
                wallet: this.checkWallet(wallet),
                email: Email.create(email)
            }),
            map(props => account.editAccount(props))
        );
        if (isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        await this.accounts.save(account);
    }

    async findOne(email: string): Promise<Account> {
        const account = await this.accounts.findByEmail(email);
        if (isNone(account)) {
            throw new NotFoundException("Account not found.");
        }
        return account.value;
    }

    async isUsernameUsed(username: string): Promise<boolean> {
        return this.accounts.isUsernameUsed(username);
    }

    async register(username: string, email: string, password: string): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                username: this.checkUsername(username),
                email: Email.create(email),
                password: Password.fromClear(password)
            }),
            map(props => Account.createUser({
                ...props,
                wallet: none
            }))
        );
        if (isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        const account = result.right;
        await this.accounts.save(account);
        this.eventEmitter.emitAsync(ACCOUNT_CREATED_EVENT, )
    }



    private async retrieveAccount(id: string): Promise<Account> {
        const accountId = UID.fromString(id, "Invalid account id.");
        if (isLeft(accountId)) {
            throw new BadRequestException(accountId.left[0]);
        }
        const account = await this.accounts.findById(accountId.right);
        if (isNone(account)) {
            throw new NotFoundException("Account not found.");
        }
        return account.value;
    }

    private checkUsername(username: string): Either<NonEmptyArray<string>, string> {
        return StringUtils.minLength(1, "Username is empty")(username);
    }

    private checkWallet(wallet: string | null): Either<NonEmptyArray<string>, Option<Wallet>> {
        if (wallet === null) {
            return right(none);
        }
        return pipe(
            Wallet.fromString(wallet),
            map(some)
        );
    }
}