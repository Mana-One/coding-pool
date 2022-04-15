import { Controller, Delete, Param, Post, Req, UseGuards } from "@nestjs/common";
import { LikesService } from "./likes.service";

@Controller("likes")
export class LikesController {
    constructor(private readonly service: LikesService) {}

    @Post(":publicationId")
    async create(
        @Req() request,
        @Param("publicationId") publicationId: string
    ) {
        await this.service.create({ userId: request.user.accountId, publicationId });
    }

    @Delete(":publicationId")
    async remove(
        @Req() request,
        @Param("publicationId") publicationId: string
    ) {
        await this.service.remove({ userId: request.user.accountId, publicationId });
    }
}