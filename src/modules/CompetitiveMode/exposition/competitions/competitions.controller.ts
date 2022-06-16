import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AppConfig } from "../../../../config/app.config";
import { PageResponse } from "../../../../kernel/PageResponse";
import { Roles } from "../../../../kernel/roles.decorator";
import { CreateCompetitionUsecase } from "../../application/competitions/create-competition/create-competition.usecase";
import { GetPublicCompetitionDetailsUsecase } from "../../application/competitions/get-public-competition-details/get-public-competition-details.usecase";
import { ListCompetitonsUsecase } from "../../application/competitions/list-competitions/list-competitions.usecase";
import { PublishCompetitionUsecase } from "../../application/competitions/publish-competition/publish-competition.usecase";
import { CreateCompetitionRequest } from "./create-competition.request";
import { ListCompetitionsRequest } from "./list-competitions.request";

@Controller("competitions")
export class CompetitionsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createCompetitionUsecase: CreateCompetitionUsecase,
        private readonly listCompetitionsUsecase: ListCompetitonsUsecase,
        private readonly getPublicCompetitionDetailsUsecase: GetPublicCompetitionDetailsUsecase,
        private readonly publishCompetitionUsecase: PublishCompetitionUsecase
    ) {}

    @Roles("admin")
    @Post()
    async createCompetiton(@Body() body: CreateCompetitionRequest) {
        await this.createCompetitionUsecase.execute(body);
    }

    @Roles("admin")
    @Put("publish/:competitionId")
    async publish(@Param("competitionId") competitionId: string) {
        await this.publishCompetitionUsecase.execute({ competitionId });
    }

    @Get()
    async listCompetitions(
        @Req() request,
        @Query() query: ListCompetitionsRequest
    ) {
        const paginated = await this.listCompetitionsUsecase.execute(query);
        const url = new URL(request.baseUrl + request.path, this.appConfig.HOST);
        url.searchParams.set("status", query.status);
        return new PageResponse(paginated, url);
    }

    @Get(":id/public")
    async getPublicDetails(@Param("id") id: string) {
        return await this.getPublicCompetitionDetailsUsecase.execute(id);
    }
}