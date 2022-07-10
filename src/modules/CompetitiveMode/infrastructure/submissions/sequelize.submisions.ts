import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { SequelizeService } from "../../../../infrastructure/sequelize/sequelize.service";
import { UID } from "../../../../kernel/uid";
import { Submission } from "../../domain/submissions/submission";
import { Submissions } from "../../domain/submissions/submissions";
import { SubmissionModel } from "./submission.model";

@Injectable()
export class SequelizeSubmissions implements Submissions {
    constructor(private readonly sequelizeService: SequelizeService) {}

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
        const transaction = await this.sequelizeService.beginTransaction();

        return SubmissionModel.findOrCreate({
            where: {
                competitionId: submission.competitionId.value,
                participantId: submission.participantId.value
            },
            defaults: {
                participant: submission.participant,
                passed: submission.passed,
                time: submission.time
            },
            transaction
        })
        .then(async ([instance, created]) => {
            if (!created) {
                await instance.update({
                    participant: submission.participant,
                    passed: submission.passed,
                    time: submission.time
                }, { transaction });
            }
            await transaction.commit();
            return created;
        })
        .catch(async err => { 
            if (transaction) {
                await transaction.rollback();
            }
            throw new InternalServerErrorException(String(err)); 
        });
    }
}