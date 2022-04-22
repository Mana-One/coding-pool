import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreatePublicationRequest } from "./create-publication.request";
import { PageResponse } from "../../../../kernel/PageResponse";
import { AppConfig } from "../../../../config/app.config";
import { PageRequest } from "../../../../kernel/PageRequest";
import { Public } from "../../../auth/public.decorator";
import { CreatePublicationUsecase } from "../../application/publications/create-publication/create-publication.usecase";
import { GetUserTimelineUsecase } from "../../application/publications/get-user-timeline.usecase.ts/get-user-timeline.usecase";

@Controller("publications")
export class PublicationsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createPublicationUsecase: CreatePublicationUsecase,
        private readonly getUserTimelineUsecase: GetUserTimelineUsecase
    ) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: CreatePublicationRequest
    ) {
        await this.createPublicationUsecase.execute({
            content: body.content,
            postedBy: request.user.accountId
        });
    }

    @Get("me")
    async getOwntTimeline(
        @Req() request,
        @Query() query: PageRequest
    ) {
        const page = await this.getUserTimelineUsecase.execute({
            userId: request.user.accountId,
            limit: query.limit,
            offset: query.offset
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }

    @Public()
    @Get(":userId")
    async getUserTimeline(
        @Req() request, 
        @Param("userId") userId: string, 
        @Query() query: PageRequest
    ) {
        const page = await this.getUserTimelineUsecase.execute({
            userId,
            limit: query.limit,
            offset: query.offset
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }
}