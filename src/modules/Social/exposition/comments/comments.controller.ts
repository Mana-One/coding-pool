import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { CreateCommentRequest } from "./create-comment.request";
import { CreateCommentUsecase } from "../../application/comments/create-comment.usecase.ts/create-comment.usecase";
import { RemoveCommentUsecase } from "../../application/comments/remove-comment/remove-comment.usecase";

@Controller("comments")
export class CommentsController {
    constructor(
        private readonly createCommentUsecase: CreateCommentUsecase,
        private readonly removeCommentUsecase: RemoveCommentUsecase
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
} 
