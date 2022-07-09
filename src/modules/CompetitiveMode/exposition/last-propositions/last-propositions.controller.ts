import { Controller, Get, Param, Req } from "@nestjs/common";
import { Roles } from "../../../../kernel/roles.decorator";
import { GetLastPropositionUsecase } from "../../application/last-proposition/get-last-proposition/get-last-proposition.usecase";

@Controller("last-propositions")
export class LastPropositionsController {
    constructor(private readonly getLastPropositionUsecase: GetLastPropositionUsecase) {}

    @Roles("user")
    @Get(":competitionId")
    async getLastProposition(
        @Req() request,
        @Param("competitionId") competitionId: string
    ) {
        return this.getLastPropositionUsecase.execute({
            competitionId,
            participantId: request.user.accountId
        });
    }
}