import { InternalServerErrorException } from "@nestjs/common";
import { Submission } from "../../domain/submissions/submission";
import { Submissions } from "../../domain/submissions/submissions";
import { SubmissionModel } from "./submission.model";

export class SequelizeSubmissions implements Submissions {
    async save(submission: Submission): Promise<boolean> {
        const [, created] = await SubmissionModel.upsert({
            competitionId: submission.competitionId.value,
            participantId: submission.participantId.value,
            participant: submission.participant,
            passed: submission.passed,
            time: submission.time
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });

        return created;
    }
}