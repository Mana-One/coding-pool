import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccountService } from "./account.service";
import { Account } from "../domain/account";

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService
    ) {}

    async validateAccount(email: string, password: string): Promise<Account> {
        const account = await this.accountService.findOne(email);
        if (!await account.password.compareWithClear(password)) {
            throw new NotFoundException("Account not found.");
        }
        return account;
    }

    async login(account: Account): Promise<string> {
        const payload = {
            sub: account.id.value,
            username: account.username,
            role: account.role.name
        };
        return this.jwtService.signAsync(payload);
    }
}