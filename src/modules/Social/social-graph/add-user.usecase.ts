import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import { UID } from "../../../kernel/UID";
import { Usecase } from "../../../kernel/Usecase";
import { AddUserCommand } from "./dtos/add-user.command";
import { SOCIAL_GRAPH_DAO } from "./constants";
import { SocialGraphDao } from "./social-graph.dao";

@Injectable()
export class AddUserUsecase implements Usecase<AddUserCommand, void> {
    constructor(@Inject(SOCIAL_GRAPH_DAO) private readonly socialGraphDao: SocialGraphDao) {}

    async execute(input: AddUserCommand): Promise<void> {
        const id = UID.fromString(input.id, "Invalid user id.");
        if (E.isLeft(id)) {
            throw new BadRequestException(id.left.join("\n"));
        }
        await this.socialGraphDao.addUser(id.right);
    }
}