import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AccountModified } from "../../../shared-kernel/account-modified.event";
import { ACCOUNT_MODIFIED_EVENT } from "../../../shared-kernel/constants";
import { SubmissionModel } from "../../infrastructure/submissions/submission.model";

@Injectable()
export class CompetitiveModeAccountModifiedListener {
    private readonly logger = new Logger(CompetitiveModeAccountModifiedListener.name);
    
    @OnEvent(ACCOUNT_MODIFIED_EVENT)
    async handle(event: AccountModified) {
        await SubmissionModel.update(
            { participant: event.username },
            { where: { participantId: event.userId }}
        ).catch(err => this.logger.error(err));
    }
}