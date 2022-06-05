import { Body, Controller, Param, Post, Put, Query, Req } from "@nestjs/common";
import { Public } from "../../../../kernel/public.decorator";
import { Roles } from "../../../../kernel/roles.decorator";
import { CreateSubmissionUsecase } from "../../application/submissions/create-submission/create-submission.usecase";
import { ReceiveSubmissionUsecase } from "../../application/submissions/receive-submission/receive-submission.usecase";
import { CreateSubmissionRequest } from "./create-submission.request";
import { ReceiveSubmissionQuery } from "./receive-submission.query";
import { ReceiveSubmissionRequest } from "./receive-submission.request";

@Controller("submissions")
export class SubmissionsController {
    constructor(
        private readonly createSubmissionUsecase: CreateSubmissionUsecase,
        private readonly receiveSubmissionUsecase: ReceiveSubmissionUsecase
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
}