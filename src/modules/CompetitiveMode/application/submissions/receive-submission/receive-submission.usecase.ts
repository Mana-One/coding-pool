import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import * as E from "fp-ts/lib/Either";
import { Usecase } from "../../../../../kernel/Usecase";
import { CompetitionEntered } from "../../../../shared-kernel/competition-entered.event";
import { COMPETITION_ENTERED } from "../../../../shared-kernel/constants";
import { SUBMISSIONS } from "../../../constants";
import { Submission } from "../../../domain/submissions/submission";
import { Submissions } from "../../../domain/submissions/submissions";
import { ReceiveSubmissionCommand } from "./receive-submission.command";

@Injectable()
export class ReceiveSubmissionUsecase implements Usecase<ReceiveSubmissionCommand, void> {

    constructor(
        @Inject(SUBMISSIONS) private readonly submissions: Submissions,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async execute(request: ReceiveSubmissionCommand): Promise<void> {
        const submission = Submission.create(request);
        if (E.isLeft(submission)) {
            throw new BadRequestException(submission.left.join("\n"));
        }

        const isNew = await this.submissions.save(submission.right);
        if (isNew) {
            this.eventEmitter.emit(COMPETITION_ENTERED, new CompetitionEntered(
                submission.right.competitionId.value,
                submission.right.participantId.value,
                new Date()
            ));
        }
    }
}