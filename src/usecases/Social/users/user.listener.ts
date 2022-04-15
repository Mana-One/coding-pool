import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../shared-kernel/account-created.event";
import { UserService } from "./user.service";

export class UserListener {
    private readonly logger = new Logger(UserListener.name);

    constructor(private readonly service: UserService) {}

    @OnEvent("account.created")
    async create(event: AccountCreated) {
        await this.service.create(event)
            .catch(err => this.logger.error(err));
    }
}