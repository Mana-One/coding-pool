import * as bcrypt from "bcrypt";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { none, some } from "fp-ts/lib/Option";
import { mock } from "jest-mock-extended";
import { UID } from "../../src/kernel/UID";
import { AccountService } from "../../src/usecases/accounts/application/account.service";
import { Account } from "../../src/usecases/accounts/domain/account.entity";
import { Accounts } from "../../src/usecases/accounts/domain/accounts";
import { Email } from "../../src/usecases/accounts/domain/email";
import { Password } from "../../src/usecases/accounts/domain/password";
import { Role } from "../../src/usecases/accounts/domain/role";
import { EventEmitter2 } from "@nestjs/event-emitter";

describe("Account service", () => {
    const accounts = mock<Accounts>();
    const eventEmitter = mock<EventEmitter2>()
    const service = new AccountService(accounts, eventEmitter);

    const mockId = UID.generate();
    const mockAccount = Account.of({
        id: mockId,
        username: "username",
        email: Email.of("some email"),
        password: Password.of(bcrypt.hashSync("azertyUIOP123", 10)),
        wallet: none,
        role: Role.USER
    });

    beforeAll(() => {
        accounts.findById.mockResolvedValue(some(mockAccount));
        accounts.findByEmail.mockResolvedValue(some(mockAccount));
        accounts.save.mockResolvedValue();
    });

    describe("changePassword", () => {
        it("should return void", async () => {
            await expect(service.changePassword(mockId.value, "azertyUIOP123", "azertyUIOP124", "azertyUIOP124"))
                .resolves
                .toBeUndefined();
        });

        it("should throw a NotFoundException when the account does not exist", async () => {
            accounts.findById.mockResolvedValueOnce(none);

            await expect(service.changePassword(mockId.value, "azertyUIOP123", "azertyUIOP124", "azertyUIOP124"))
                .rejects
                .toBeInstanceOf(NotFoundException);
        });

        it("should throw a BadRequestException when the old password does not match", async () => {
            await expect(service.changePassword(mockId.value, "azertyUIOP125", "azertyUIOP124", "azertyUIOP124"))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it("should throw a BadRequestException when the new password and confirmation do not match", async () => {
            await expect(service.changePassword(mockId.value, "azertyUIOP123", "azertyUIOP124", "azertyUIOP125"))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });

        it("should throw a BadRequestException when the new password is invalid", async () => {
            await expect(service.changePassword(mockId.value, "azertyUIOP123", "azerty", "azerty"))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });
    });

    describe("edit", () => {
        it("should return void", async () => {
            await expect(service.edit(mockId.value, "username", null, "username@example.com"))
                .resolves
                .toBeUndefined();
        });

        it("should throw a NotFoundException when the account does not exist", async () => {
            accounts.findById.mockResolvedValueOnce(none);

            await expect(service.edit(mockId.value, "username", null, "username@example.com"))
                .rejects
                .toBeInstanceOf(NotFoundException);
        });

        it("should throw a BadRequestException when the input is invalid", async () => {
            await expect(service.edit(mockId.value, "", null, "username@example"))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });
    });

    describe("findByEmail", () => {
        it("should return an account", async () => {
            await expect(service.findOne("some email"))
                .resolves
                .toBeInstanceOf(Account);
        });

        it("should throw a NotFoundException", async () => {
            accounts.findByEmail.mockResolvedValueOnce(none);
            await expect(service.findOne("some email"))
                .rejects
                .toBeInstanceOf(NotFoundException);
        });
    });

    describe("register", () => {
        it("should return void", async () => {
            await expect(service.register("username", "username@example.com", "azertyUIOP123"))
                .resolves
                .toBeUndefined();
        });

        it("should throw a BadRequestException when the input is invalid", async () => {
            await expect(service.register("", "username@example.com", "azertyUIOP+/="))
                .rejects
                .toBeInstanceOf(BadRequestException);
        });
    });
});