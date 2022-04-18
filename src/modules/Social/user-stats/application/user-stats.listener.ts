import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT } from "../../../shared-kernel/constants";
import { CreateUserStatsUsecase } from "./create-user-stats.usecase";

@Injectable()
export class UserStatsListener {
    private readonly logger = new Logger(UserStatsListener.name);

    constructor(private readonly createUserStats: CreateUserStatsUsecase) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async handleAccountCreated(event: AccountCreated): Promise<void> {
        await this.createUserStats.execute(event)
            .catch(this.logger.error);
    }
}