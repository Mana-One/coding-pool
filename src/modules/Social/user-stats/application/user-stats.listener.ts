import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT, USER_FOLLOWED_EVENT } from "../../../shared-kernel/constants";
import { UserFollowed } from "../../../shared-kernel/user-followed.event";
import { CreateUserStatsUsecase } from "./create-user-stats.usecase";
import { IncrementFollowersUsecase } from "./increment-followers.usecase";
import { IncrementFollowingUsecase } from "./increment-following.usecase";

@Injectable()
export class UserStatsListener {
    private readonly logger = new Logger(UserStatsListener.name);

    constructor(
        private readonly createUserStats: CreateUserStatsUsecase,
        private readonly incrementFollowers: IncrementFollowersUsecase,
        private readonly incrementFollowing: IncrementFollowingUsecase
    ) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async handleAccountCreated(event: AccountCreated): Promise<void> {
        await this.createUserStats.execute(event)
            .catch(this.logger.error);
    }

    @OnEvent(USER_FOLLOWED_EVENT)
    async handleUserFollowed(event: UserFollowed): Promise<void> {
        await this.incrementFollowers.execute({ id: event.followee })
            .then(async () => await this.incrementFollowing.execute({ id: event.follower }))
            .catch(this.logger.error);
    }
}