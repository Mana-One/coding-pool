import { BadRequestException, Inject } from "@nestjs/common";
import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { Usecase } from "../../../../../kernel/Usecase";
import { LAST_PROPOSITIONS } from "../../../constants";
import { LastPropositions } from "../../../domain/last-proposition/last-propositions";
import { GetLastPropositionQuery } from "./get-last-proposition.query";
import { GetLastPropositionView } from "./get-last-proposition.view";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../../../kernel/fp-utils";
import { UID } from "../../../../../kernel/uid";
import { LastProposition } from "../../../domain/last-proposition/last-proposition";

export class GetLastPropositionUsecase 
    implements Usecase<GetLastPropositionQuery, GetLastPropositionView>
{
    constructor(@Inject(LAST_PROPOSITIONS) private readonly lastPropositions: LastPropositions) {}

    async execute(request: GetLastPropositionQuery): Promise<GetLastPropositionView> {
        const check = pipe(
            sequenceT(cumulativeValidation)(
                UID.fromString(request.competitionId, "Invalid competition id."),
                UID.fromString(request.participantId, "Invlaid participant id.")
            )
        );
        if (E.isLeft(check)) {
            throw new BadRequestException(check.left.join("\n"));
        }

        const [competitionId, participantId] = check.right;
        const lastProposition = await this.lastPropositions.findBy(competitionId, participantId);
        
        const sourceCode = O.map((x: LastProposition) => x.sourceCode)(lastProposition)
        return {
            sourceCode: O.toNullable(sourceCode)
        };
    }
}