import { InternalServerErrorException } from "@nestjs/common";
import { Usecase } from "../../../../../kernel/Usecase";
import { SubmissionModel } from "../../../infrastructure/submissions/submission.model";
import { GetLeaderboardsQuery } from "./get-leaderboards.query";
import { Leaderboards } from "./leaderboards";
import { LeaderboardsEntryDto } from "./leaderboards-entry.dto";

export class GetLeaderboardsUsecase implements Usecase<GetLeaderboardsQuery, Leaderboards> {
    async execute(request: GetLeaderboardsQuery): Promise<Leaderboards> {
        return await SubmissionModel.findAndCountAll({
            where: { competitionId: request.competitionId },
            order: [["passed", "DESC"], ["time", "ASC"]],
            limit: request.limit,
            offset: request.offset
        })
        .then(result => new Leaderboards(
            result.rows.map(r => this.toDto(r)),
            result.count,
            request.limit,
            request.offset
        ))
        .catch(err => { throw new InternalServerErrorException(String(err)); });
        
    }

    private toDto(instance: SubmissionModel): LeaderboardsEntryDto {
        return {
            participant: {
                id: instance.participantId,
                username: instance.participant
            },
            competitionId: instance.competitionId,
            time: instance.time,
            passed: instance.passed
        };
    }
}