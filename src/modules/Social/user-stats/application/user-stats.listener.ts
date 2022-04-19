import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT, USER_FOLLOWED_EVENT, USER_UNFOLLOWED_EVENT } from "../../../shared-kernel/constants";
import { UserFollowed } from "../../../shared-kernel/user-followed.event";
import { UserUnfollowed } from "../../../shared-kernel/user-unfollowed.event";
import { CreateUserStatsUsecase } from "./create-user-stats.usecase";
import { DecrementFollowersUsecase } from "./decrement-followers.usecase";
import { DecrementFollowingUsecase } from "./decrement-following.usecase";
import { IncrementFollowersUsecase } from "./increment-followers.usecase";
import { IncrementFollowingUsecase } from "./increment-following.usecase";

@Injectable()
export class UserStatsListener {
    private readonly logger = new Logger(UserStatsListener.name);

    constructor(
        private readonly createUserStats: CreateUserStatsUsecase,
        private readonly incrementFollowers: IncrementFollowersUsecase,
        private readonly incrementFollowing: IncrementFollowingUsecase,
        private readonly decrementFollowers: DecrementFollowersUsecase,
        private readonly decrementFollowing: DecrementFollowingUsecase
    ) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async handleAccountCreated(event: AccountCreated): Promise<void> {
        await this.createUserStats.execute(event)
            .catch(err => this.logger.error(err));
    }

    @OnEvent(USER_FOLLOWED_EVENT)
    async handleUserFollowed(event: UserFollowed): Promise<void> {
        await this.incrementFollowers.execute({ id: event.followee })
            .then(async () => await this.incrementFollowing.execute({ id: event.follower }))
            .catch(err => this.logger.error(err));
    }

    @OnEvent(USER_UNFOLLOWED_EVENT)
    async handleUserUnfollowed(event: UserUnfollowed): Promise<void> {
        await this.decrementFollowers.execute({ id: event.followee })
            .then(async () => await this.decrementFollowing.execute({ id: event.follower }))
            .catch(err => this.logger.error(err));
    }
}