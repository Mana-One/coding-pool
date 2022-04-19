import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { UID } from "../../../../kernel/UID";
import { Usecase } from "../../../../kernel/Usecase";
import { USER_UNFOLLOWED_EVENT } from "../../../shared-kernel/constants";
import { UserUnfollowed } from "../../../shared-kernel/user-unfollowed.event";
import { SOCIAL_GRAPH_DAO } from "../constants";
import { FollowUserCommand } from "../dtos/follow-user.command";
import { SocialGraphDao } from "./social-graph.dao";

@Injectable()
export class UnfollowUserUsecase implements Usecase<FollowUserCommand, void> {
    constructor(
        @Inject(SOCIAL_GRAPH_DAO) private readonly socialGraphDao: SocialGraphDao,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async execute(input: FollowUserCommand): Promise<void> {
        const check = pipe(
            sequenceS(cumulativeValidation)({
                follower: UID.fromString(input.follower, "Invalid follower id."),
                followee: UID.fromString(input.followee, "Invalid followee id.")
            })
        );
        if (E.isLeft(check)) {
            throw new BadRequestException(check.left.join("\n"));
        }

        const data = check.right;
        await this.socialGraphDao.removeFollowRelationShip(data.follower, data.followee);
        this.eventEmitter.emit(USER_UNFOLLOWED_EVENT, new UserUnfollowed(data.followee.value, data.follower.value));
    }
}