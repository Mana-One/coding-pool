import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AccountModel } from "../infrastructure/account.model";
import { Profile } from "./profile.dto";

@Injectable()
export class ProfileService {
    async getProfile(id: string): Promise<Profile> {
        const instance = await AccountModel
            .findByPk(id)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        if (instance === null) {
            throw new NotFoundException(`Profile with id '${id}' not found.`);
        }
        return {
            id: instance.id,
            username: instance.username,
            wallet: instance.wallet,
            email: instance.email,
            role: instance.role
        };
    }
}