import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { UID } from "../../../kernel/UID";
import { Usecase } from "../../../kernel/Usecase";
import { USER_FOLLOWED_EVENT } from "../../shared-kernel/constants";
import { UserFollowed } from "../../shared-kernel/user-followed.event";
import { SOCIAL_GRAPH_DAO } from "./constants";
import { FollowUserCommand } from "./follow-user.command";
import { SocialGraphDao } from "./social-graph.dao";

@Injectable()
export class FollowUserUsecase implements Usecase<FollowUserCommand, void> {
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
        await this.socialGraphDao.addFollowRelationship(data.follower, data.followee);
        this.eventEmitter.emit(USER_FOLLOWED_EVENT, new UserFollowed(data.followee.value, data.follower.value));
    }
}