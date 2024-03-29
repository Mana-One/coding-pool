import { Body, Controller, Delete, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreatePublicationRequest } from "./create-publication.request";
import { PageResponse } from "../../../../kernel/PageResponse";
import { AppConfig } from "../../../../config/app.config";
import { PageRequest } from "../../../../kernel/PageRequest";
import { CreatePublicationUsecase } from "../../application/publications/create-publication/create-publication.usecase";
import { GetUserTimelineUsecase } from "../../application/publications/get-user-timeline/get-user-timeline.usecase";
import { GetHomeTimelineUsecase } from "../../application/publications/get-home-timeline/get-home-timeline.usecase";
import { GetPublicationUsecase } from "../../application/publications/get-publication/get-publication.usecase";
import { RemovePublicationUsecase } from "../../application/publications/remove-publication/remove-publication.usecase";

@Controller("publications")
export class PublicationsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createPublicationUsecase: CreatePublicationUsecase,
        private readonly getUserTimelineUsecase: GetUserTimelineUsecase,
        private readonly getHomeTimelineUsecase: GetHomeTimelineUsecase,
        private readonly getPublicationUsecase: GetPublicationUsecase,
        private readonly removePublicationUsecase: RemovePublicationUsecase
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

    @Get("timeline/me")
    async getOwnTimeline(
        @Req() request,
        @Query() query: PageRequest
    ) {
        const page = await this.getUserTimelineUsecase.execute({
            userId: request.user.accountId,
            limit: query.limit,
            offset: query.offset,
            callerId: request.user.accountId
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }

    @Get("timeline/home")
    async getHomeTimeline(
        @Req() request,
        @Query() query: PageRequest
    ) {
        const page = await this.getHomeTimelineUsecase.execute({
            userId: request.user.accountId,
            limit: query.limit,
            offset: query.offset,
            callerId: request.user.accountId
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }

    @Get("timeline/:userId")
    async getUserTimeline(
        @Req() request, 
        @Param("userId") userId: string, 
        @Query() query: PageRequest
    ) {
        const page = await this.getUserTimelineUsecase.execute({
            userId,
            limit: query.limit,
            offset: query.offset,
            callerId: request.user.accountId
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }

    @Get(":id")
    async getPublication(
        @Param("id") id: string,
        @Req() request
    ) {
        return this.getPublicationUsecase.execute({ id, callerId: request.user.accountId });
    }

    @Delete(":publicationId")
    async removePublication(
        @Req() request, 
        @Param("publicationId") publicationId: string
    ) {
        await this.removePublicationUsecase.execute({
            publicationId,
            callerId: request.user.accountId
        });
    }
}