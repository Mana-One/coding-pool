import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT } from "../../shared-kernel/constants";
import { UserService } from "./user.service";

@Injectable()
export class UserListener {
    private readonly logger = new Logger(UserListener.name);

    constructor(private readonly service: UserService) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async create(event: AccountCreated) {
        await this.service.create(event)
            .catch(err => this.logger.error(err));
    }
}