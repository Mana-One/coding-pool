import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import { UID } from "../../../../kernel/UID";
import { Usecase } from "../../../../kernel/Usecase";
import { AddUserCommand } from "../dtos/add-user.command";
import { SOCIAL_GRAPH_DAO } from "../constants";
import { SocialGraphDao } from "./social-graph.dao";
import { pipe } from "fp-ts/lib/function";
import { sequenceS } from "fp-ts/lib/Apply";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { StringUtils } from "../../../../kernel/StringUtils";

@Injectable()
export class AddUserUsecase implements Usecase<AddUserCommand, void> {
    constructor(@Inject(SOCIAL_GRAPH_DAO) private readonly socialGraphDao: SocialGraphDao) {}

    async execute(input: AddUserCommand): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                id: UID.fromString(input.id, "Invalid user id."),
                username: StringUtils.minLength(1, "Username is empty")(input.username)
            })
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        const data = result.right;
        await this.socialGraphDao.addUser(data.id, data.username);
    }
}