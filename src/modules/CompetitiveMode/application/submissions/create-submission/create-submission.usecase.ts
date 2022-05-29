import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../../kernel/UID";
import { Usecase } from "../../../../../kernel/Usecase";
import { Competitions } from "../../../domain/competitions/competitions";
import { CodeJudge } from "../code-judge";
import { CreateSubmissionCommand } from "./create-submission.command";
import { CreateSubmissionView } from "./create-submission.view";

@Injectable()
export class CreateSubmissionUsecase implements Usecase<CreateSubmissionCommand, CreateSubmissionView> {
    constructor(
        private readonly competitions: Competitions,
        private readonly codeJudge: CodeJudge
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

        return this.codeJudge.send({
            competitionId: request.competitionId,
            participantId: request.participantId,
            participant: request.participant,
            source_code: request.source_code,
            stdin: competition.value.stdin,
            expectedStdout: competition.value.expectedStdout
        });
    }
}