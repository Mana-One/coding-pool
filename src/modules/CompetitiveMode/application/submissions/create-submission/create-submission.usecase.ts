import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../../kernel/uid";
import { Usecase } from "../../../../../kernel/Usecase";
import { CODE_JUDGE, COMPETITIONS, LAST_PROPOSITIONS } from "../../../constants";
import { Competitions } from "../../../domain/competitions/competitions";
import { LastProposition } from "../../../domain/last-proposition/last-proposition";
import { LastPropositions } from "../../../domain/last-proposition/last-propositions";
import { CodeJudge } from "../code-judge";
import { CreateSubmissionCommand } from "./create-submission.command";
import { CreateSubmissionView } from "./create-submission.view";

@Injectable()
export class CreateSubmissionUsecase implements Usecase<CreateSubmissionCommand, CreateSubmissionView> {
    constructor(
        @Inject(COMPETITIONS) private readonly competitions: Competitions,
        @Inject(LAST_PROPOSITIONS) private readonly lastPropositions: LastPropositions,
        @Inject(CODE_JUDGE) private readonly codeJudge: CodeJudge
    ) {}

    async execute(request: CreateSubmissionCommand): Promise<CreateSubmissionView> {
        const competitionId = UID.fromString(request.competitionId, "Invalid competition id.");
        if (E.isLeft(competitionId)) {
            throw new BadRequestException(competitionId.left.join("\n"));
        }

        const competition = await this.competitions.findById(competitionId.right);
        if (O.isNone(competition)) {
            throw new NotFoundException("Competition not found.");
        }

        const lastProposition = LastProposition.create({
            competitionId: request.competitionId,
            participantId: request.participantId,
            sourceCode: request.source_code
        });
        if (E.isLeft(lastProposition)) {
            throw new BadRequestException(lastProposition.left.join("\n"));
        }

        await this.lastPropositions.save(lastProposition.right);

        return this.codeJudge.send({
            competitionId: request.competitionId,
            participantId: request.participantId,
            participant: request.participant,
            language_id: competition.value.languageId,
            source_code: request.source_code,
            stdin: competition.value.stdin,
            expectedStdout: competition.value.expectedStdout
        });
    }
}