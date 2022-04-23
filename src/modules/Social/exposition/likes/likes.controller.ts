import { Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { AddLikeUsecase } from "../../application/likes/add-like/add-like.usecase";
import { RemoveLikeUsecase } from "../../application/likes/remove-like/remove-like.usecase";

@Controller("likes")
export class LikesController {
    constructor(
        private readonly addLikeUsecase: AddLikeUsecase,
        private readonly removeLikeUsecase: RemoveLikeUsecase
    ) {}

    @Post(":publicationId")
    async create(
        @Req() request,
        @Param("publicationId") publicationId: string
    ) {
        await this.addLikeUsecase.execute({ userId: request.user.accountId, publicationId });
    }

    @Delete(":publicationId")
    async remove(
        @Req() request,
        @Param("publicationId") publicationId: string
    ) {
        await this.removeLikeUsecase.execute({ userId: request.user.accountId, publicationId });
    }
}