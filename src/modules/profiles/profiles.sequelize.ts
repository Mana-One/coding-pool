import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { AccountModel } from "../accounts/infrastructure/account.model";
import { Profile } from "./profile.dto";
import { Profiles } from "./profiles";

@Injectable()
export class SequelizeProfiles implements Profiles {
    async findById(id: string): Promise<Option<Profile>> {
        const instance = await AccountModel
            .findByPk(id)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance === null ? none : some({
            id: instance.id,
            username: instance.username,
            wallet: instance.wallet,
            email: instance.email,
            role: instance.role
        });
    }
}