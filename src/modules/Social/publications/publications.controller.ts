import { Body, Controller, Post, Req } from "@nestjs/common";
import { PublicationCreationRequest } from "./dtos/publication-creation.request";
import { PublicationService } from "./publication.service";

@Controller("publications")
export class PublicationsController {
    constructor(private readonly publicationService: PublicationService) {}

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
}