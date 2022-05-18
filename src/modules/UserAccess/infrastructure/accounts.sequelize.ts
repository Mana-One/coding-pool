import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { Account } from "../domain/account";
import { Accounts } from "../domain/accounts";
import { AccountMapper } from "./account.mapper";
import { AccountModel } from "./account.model";

@Injectable()
export class SequelizeAccounts implements Accounts {
    constructor(private readonly mapper: AccountMapper) {}

    async findByEmail(email: string): Promise<Option<Account>> {
        const instance = await AccountModel.findOne(
            { where: { email }
        }).catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance === null ? none : some(this.mapper.toDomain(instance));
    }

    async findById(id: UID): Promise<Option<Account>> {
        const instance = await AccountModel.findByPk(id.value)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance === null ? none : some(this.mapper.toDomain(instance));
    }

    async isUsernameUsed(username: string): Promise<boolean> {
        const instance = await AccountModel.findOne({
            where: { username }
        }).catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance !== null;
    }
    
    async save(entity: Account): Promise<void> {
        await AccountModel.upsert(
            await this.mapper.toPersistence(entity)
        ).catch(err => { throw new InternalServerErrorException(String(err)); });
    }
}