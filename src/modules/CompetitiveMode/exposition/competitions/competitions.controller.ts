import { Body, Controller, Post } from "@nestjs/common";
import { Roles } from "../../../../kernel/roles.decorator";
import { CreateCompetitionUsecase } from "../../application/competitions/create-competition/create-competition.usecase";
import { CreateCompetitionRequest } from "./create-competition.request";

@Controller("competitions")
export class CompetitionsController {
    constructor(private readonly createCompetitionUsecase: CreateCompetitionUsecase) {}

    @Roles("admin")
    @Post()
    async createCompetiton(@Body() body: CreateCompetitionRequest) {
        await this.createCompetitionUsecase.execute(body);
    }
}