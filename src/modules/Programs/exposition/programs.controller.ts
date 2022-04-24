import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { request } from "http";
import { AppConfig } from "../../../config/app.config";
import { PageRequest } from "../../../kernel/PageRequest";
import { PageResponse } from "../../../kernel/PageResponse";
import { Public } from "../../auth/public.decorator";
import { CreateProgramUsecase } from "../application/create-program/create-program.usecase";
import { ListProgramsUsecase } from "../application/list-programs/list-programs.usecase";
import { ReplaceContentUsecase } from "../application/replace-content/replace-content.usecase";
import { CreateProgramRequest } from "./create-program.request";
import { ListProgramsRequest } from "./list-programs.request";
import { ReplaceContentRequest } from "./replace-content.request";

@Controller("programs")
export class ProgramsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createProgramUsecase: CreateProgramUsecase,
        private readonly listProgramsUsecase: ListProgramsUsecase,
        private readonly replaceContentUsecase: ReplaceContentUsecase
    ) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: CreateProgramRequest
    ) {
        await this.createProgramUsecase.execute({
            title: request.title,
            authorId: request.user.accountId,
            languageId: body.languageId
        });
    }

    @Put(":id")
    async replaceContent(
        @Req() request,
        @Param("id") id: string,
        @Body() body: ReplaceContentRequest
    ) {
        await this.replaceContentUsecase.execute({
            id,
            content: body.content,
            callerId: request.user.accountId
        });
    }

    @Get("me")
    async getOwnPortfolio(
        @Req() request,
        @Query() query: PageRequest
    ) {
        const page = await this.listProgramsUsecase.execute({
            authorId: request.user.accountId,
            limit: query.limit,
            offset: query.offset
        });
        return new PageResponse(
            page, 
            new URL(request.baseUrl + request.path, this.appConfig.HOST)
        );
    }

    @Public()
    @Get()
    async getPortfolio(
        @Req() request,
        @Query() query: ListProgramsRequest
    ) {
        const page = await this.listProgramsUsecase.execute(query);
        const url = new URL(request.baseUrl + request.path, this.appConfig.HOST);
        url.searchParams.set("authorId", query.authorId);
        return new PageResponse(page, url);
    }

}