import { InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { Submission } from "../../domain/submissions/submission";
import { Submissions } from "../../domain/submissions/submissions";
import { SubmissionModel } from "./submission.model";

export class SequelizeSubmissions implements Submissions {
    async findWinnerInCompetition(competitionId: UID): Promise<Option<Submission>> {
        const rows = await SubmissionModel.findAll({
            where: { competitionId: competitionId.value, passed: true },
            order: [["time", "ASC"]],
            limit: 1
        });
        if (rows.length === 0) {
            return none;
        }
        const instance = rows[0];
        return some(Submission.of({
            competitionId: instance.competitionId,
            participantId: instance.participantId,
            participant: instance.participant,
            passed: instance.passed,
            time: instance.time
        }));
    }

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