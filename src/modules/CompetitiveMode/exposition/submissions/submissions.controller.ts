import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AppConfig } from "../../../../config/app.config";
import { PageRequest } from "../../../../kernel/PageRequest";
import { PageResponse } from "../../../../kernel/PageResponse";
import { Public } from "../../../../kernel/public.decorator";
import { Roles } from "../../../../kernel/roles.decorator";
import { GetLeaderboardsUsecase } from "../../application/submissions/get-leaderboards/get-leaderboards.usecase";
import { CreateSubmissionUsecase } from "../../application/submissions/create-submission/create-submission.usecase";
import { ReceiveSubmissionUsecase } from "../../application/submissions/receive-submission/receive-submission.usecase";
import { CreateSubmissionRequest } from "./create-submission.request";
import { ReceiveSubmissionQuery } from "./receive-submission.query";
import { ReceiveSubmissionRequest } from "./receive-submission.request";

@Controller("submissions")
export class SubmissionsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createSubmissionUsecase: CreateSubmissionUsecase,
        private readonly receiveSubmissionUsecase: ReceiveSubmissionUsecase,
        private readonly getLeaderboardsUsecase: GetLeaderboardsUsecase
    ) {}

    @Roles("user")
    @Post(":competitionId")
    async create(
        @Req() request,
        @Param("competitionId") competitionId: string,
        @Body() body: CreateSubmissionRequest
    ) {
        const user = request.user;
        return await this.createSubmissionUsecase.execute({
            competitionId,
            participantId: user.accountId,
            participant: user.username,
            source_code: body.source_code
        });
    }

    @Public()
    @Put()
    async receive(
        @Query() query: ReceiveSubmissionQuery,
        @Body() body: ReceiveSubmissionRequest
    ) {
        await this.receiveSubmissionUsecase.execute({
            competitionId: query.competitionId,
            participantId: query.participantId,
            participant: query.participant,
            passed: body.status.id === 3,
            time: body.time
        });
    }

    @Get("leaderboards/:competitionId")
    async getLeaderboards(
        @Req() req,
        @Query() query: PageRequest,
        @Param("competitionId") competitionId: string
    ) {
        const paginated = await this.getLeaderboardsUsecase.execute({
            competitionId,
            limit: query.limit,
            offset: query.offset
        });
        const url = new URL(req.baseUrl + req.path, this.appConfig.HOST);
        return new PageResponse(paginated, url);
    }
}