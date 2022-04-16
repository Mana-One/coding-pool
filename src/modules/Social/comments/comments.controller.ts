import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentRequest } from "./dtos/create-comment.request";

@Controller("comments")
export class CommentsController {
    constructor(private readonly service: CommentsService) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: CreateCommentRequest
    ) {
        await this.service.create({
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
        await this.service.remove({
            commentId,
            userId: request.user.accountId
        });
    }
} 
