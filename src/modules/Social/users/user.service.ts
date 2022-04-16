import { Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";
import { USERS } from "./constants";
import { InvalidUser } from "./errors";
import { UserCreationCommand } from "./user-creation.command";
import { User } from "./user.entity";
import { Users } from "./users";

@Injectable()
export class UserService {
    constructor(
        @Inject(USERS)
        private readonly users: Users
    ) {}

    async create(command: UserCreationCommand): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                id: UID.fromString(command.id, "Invalid user id."),
                username: StringUtils.minLength(1, "Empty username.")(command.username)
            }),
            E.map(props => User.of({ ...props, memberSince: new Date() }))
        );
        if (E.isLeft(result)) {
            throw InvalidUser.fromMessages(result.left);
        }

        await this.users.save(result.right);
    }
}