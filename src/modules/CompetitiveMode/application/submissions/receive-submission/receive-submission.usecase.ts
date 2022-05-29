import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import { Usecase } from "../../../../../kernel/Usecase";
import { SUBMISSIONS } from "../../../constants";
import { Submission } from "../../../domain/submissions/submission";
import { Submissions } from "../../../domain/submissions/submissions";
import { ReceiveSubmissionCommand } from "./receive-submission.command";

@Injectable()
export class ReceiveSubmissionUsecase implements Usecase<ReceiveSubmissionCommand, void> {
    constructor(@Inject(SUBMISSIONS) private readonly submissions: Submissions) {}

    async execute(request: ReceiveSubmissionCommand): Promise<void> {
        const submission = Submission.create(request);
        if (E.isLeft(submission)) {
            throw new BadRequestException(submission.left.join("\n"));
        }

        await this.submissions.save(submission.right);
    }
}