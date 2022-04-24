import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateProgramUsecase } from "../application/create-program/create-program.usecase";
import { CreateProgramRequest } from "./create-program.request";

@Controller("programs")
export class ProgramsController {
    constructor(private readonly createProgramUsecase: CreateProgramUsecase) {}

    @Post()
    async create(
        @Req() request,
        @Body() body: CreateProgramRequest
    ) {
        await this.createProgramUsecase.execute({
            authorId: request.user.accountId,
            languageId: body.languageId
        });
    }
}