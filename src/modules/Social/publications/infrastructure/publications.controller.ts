import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { PublicationCreationRequest } from "../dtos/publication-creation.request";
import { PublicationService } from "../application/publication.service";
import { PageResponse } from "../../../../kernel/PageResponse";
import { AppConfig } from "../../../../config/app.config";
import { PageRequest } from "../../../../kernel/PageRequest";
import { Public } from "../../../auth/public.decorator";

@Controller("publications")
export class PublicationsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly publicationService: PublicationService
    ) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: PublicationCreationRequest
    ) {
        await this.publicationService.create({
            content: body.content,
            postedBy: request.user.accountId
        });
    }

    @Get("me")
    async getOwntTimeline(
        @Req() request,
        @Query() query: PageRequest
    ) {
        const page = await this.publicationService.getUserTimeline({
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
        const page = await this.publicationService.getUserTimeline({
            userId,
            limit: query.limit,
            offset: query.offset
        });
        return new PageResponse(page, new URL(request.baseUrl + request.path, this.appConfig.HOST));
    }
}