import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../shared-kernel/account-created.event";
import { CreateUserStatsUsecase } from "./create-user-stats.usecase";

@Injectable()
export class UserStatsListener {
    private readonly logger = new Logger(UserStatsListener.name);

    constructor(private readonly createUserStats: CreateUserStatsUsecase) {}

    @OnEvent("account.created")
    async handleAccountCreated(event: AccountCreated): Promise<void> {
        await this.createUserStats.execute(event)
            .catch(this.logger.error);
    }
}