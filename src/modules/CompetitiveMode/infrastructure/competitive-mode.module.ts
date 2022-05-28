import { Module } from "@nestjs/common";
import { CreateCompetitionUsecase } from "../application/competitions/create-competition/create-competition.usecase";
import { GetPublicCompetitionDetailsUsecase } from "../application/competitions/get-public-competition-details/get-public-competition-details.usecase";
import { ListCompetitonsUsecase } from "../application/competitions/list-competitions/list-competitions.usecase";
import { COMPETITIONS } from "../constants";
import { CompetitionsController } from "../exposition/competitions/competitions.controller";
import { CompetitionMapper } from "./competitions/competition.mapper";
import { InMemoryCompetitions } from "./competitions/in-memory.competitions";
import { SequelizeCompetitions } from "./competitions/sequelize.competitions";

const competitionProviders = [
    CreateCompetitionUsecase,
    ListCompetitonsUsecase,
    GetPublicCompetitionDetailsUsecase,
    CompetitionMapper,
    {
        provide: COMPETITIONS,
        useClass: process.env.NODE_ENV === "production" ? SequelizeCompetitions : InMemoryCompetitions
    }
]

@Module({
    providers: [...competitionProviders],
    controllers: [CompetitionsController]
})
export class CompetitiveModeModule {}