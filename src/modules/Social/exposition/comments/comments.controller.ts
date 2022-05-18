import { Body, Controller, Delete, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreateCommentRequest } from "./create-comment.request";
import { CreateCommentUsecase } from "../../application/comments/create-comment/create-comment.usecase";
import { RemoveCommentUsecase } from "../../application/comments/remove-comment/remove-comment.usecase";
import { Public } from "../../../UserAccess/auth/public.decorator";
import { ListCommentsUsecase } from "../../application/comments/list-comments/list-comments.usecase";
import { ListCommentsRequest } from "./list-comments.request";
import { request } from "http";
import { AppConfig } from "../../../../config/app.config";
import { PageResponse } from "../../../../kernel/PageResponse";

@Controller("comments")
export class CommentsController {
    constructor(
        private readonly appConfig: AppConfig,
        private readonly createCommentUsecase: CreateCommentUsecase,
        private readonly removeCommentUsecase: RemoveCommentUsecase,
        private readonly listCommentsUsecase: ListCommentsUsecase
    ) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: CreateCommentRequest
    ) {
        await this.createCommentUsecase.execute({
            content: body.content,
            userId: request.user.accountId,
            publicationId: body.publicationId
        })
    }

    @Delete(":id")
    async remove(
        @Req() request,
        @Param("id") commentId: string
    ) {
        await this.removeCommentUsecase.execute({
            commentId,
            userId: request.user.accountId
        });
    }

    @Public()
    @Get()
    async listComments(
        @Req() request,
        @Query() query: ListCommentsRequest
    ) {
        const page = await this.listCommentsUsecase.execute(query);
        const url = new URL(request.baseUrl + request.path, this.appConfig.HOST);
        url.searchParams.set("publicationId", query.publicationId);
        return new PageResponse(page, url);
    }
} 
