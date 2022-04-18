import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountCreated } from "../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT } from "../../shared-kernel/constants";
import { AddUserUsecase } from "./add-user.usecase";

@Injectable()
export class SocialGraphListener {
    private readonly logger = new Logger(SocialGraphListener.name);

    constructor(private readonly addUser: AddUserUsecase) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async handleAccountCreated(event: AccountCreated): Promise<void> {
        await this.addUser.execute(event)
            .catch(err => this.logger.error(err));
    }
}