import { Module } from "@nestjs/common";
import { CreateCompetitionUsecase } from "../application/competitions/create-competition/create-competition.usecase";
import { COMPETITIONS } from "../constants";
import { CompetitionMapper } from "./competitions/competition.mapper";
import { SequelizeCompetitions } from "./competitions/sequelize.competitions";

const competitionProviders = [
    CreateCompetitionUsecase,
    CompetitionMapper,
    {
        provide: COMPETITIONS,
        useClass: SequelizeCompetitions
    }
]

@Module({
    providers: [...competitionProviders]
})
export class CompetitiveModeModule {}