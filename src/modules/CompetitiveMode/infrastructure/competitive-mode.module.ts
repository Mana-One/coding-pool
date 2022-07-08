import { Module } from "@nestjs/common";
import { CreateCompetitionUsecase } from "../application/competitions/create-competition/create-competition.usecase";
import { GetLeaderboardsUsecase } from "../application/submissions/get-leaderboards/get-leaderboards.usecase";
import { GetPublicCompetitionDetailsUsecase } from "../application/competitions/get-public-competition-details/get-public-competition-details.usecase";
import { ListCompetitonsUsecase } from "../application/competitions/list-competitions/list-competitions.usecase";
import { CreateSubmissionUsecase } from "../application/submissions/create-submission/create-submission.usecase";
import { ReceiveSubmissionUsecase } from "../application/submissions/receive-submission/receive-submission.usecase";
import { CODE_JUDGE, COMPETITIONS, SUBMISSIONS } from "../constants";
import { CompetitionsController } from "../exposition/competitions/competitions.controller";
import { SubmissionsController } from "../exposition/submissions/submissions.controller";
import { CompetitionMapper } from "./competitions/competition.mapper";
import { SequelizeCompetitions } from "./competitions/sequelize.competitions";
import { Judg0Gateway } from "./submissions/judge0-gateway";
import { SequelizeSubmissions } from "./submissions/sequelize.submisions";
import { PublishCompetitionUsecase } from "../application/competitions/publish-competition/publish-competition.usecase";

const competitionProviders = [
    CreateCompetitionUsecase,
    ListCompetitonsUsecase,
    GetPublicCompetitionDetailsUsecase,
    PublishCompetitionUsecase,
    CompetitionMapper,
    {
        provide: COMPETITIONS,
        useClass: SequelizeCompetitions
    }
];

const submissionProviders = [
    CreateSubmissionUsecase,
    ReceiveSubmissionUsecase,
    GetLeaderboardsUsecase,
    {
        provide: CODE_JUDGE,
        useClass: Judg0Gateway
    }, 
    {
        provide: SUBMISSIONS,
        useClass: SequelizeSubmissions
    }
]

@Module({
    providers: [...competitionProviders, ...submissionProviders],
    controllers: [CompetitionsController, SubmissionsController]
})
export class CompetitiveModeModule {}