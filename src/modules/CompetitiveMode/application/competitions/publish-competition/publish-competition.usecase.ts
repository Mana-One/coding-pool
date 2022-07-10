import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../../kernel/uid";
import { Usecase } from "../../../../../kernel/Usecase";
import { WINNER_COMPUTED } from "../../../../shared-kernel/constants";
import { WinnerComputed } from "../../../../shared-kernel/winner-computed.event";
import { COMPETITIONS, SUBMISSIONS } from "../../../constants";
import { Competition } from "../../../domain/competitions/competition";
import { Competitions } from "../../../domain/competitions/competitions";
import { Submissions } from "../../../domain/submissions/submissions";
import { PublishCompetitionCommand } from "./publish-competition.command";

@Injectable()
export class PublishCompetitionUsecase implements Usecase<PublishCompetitionCommand, void> {
    constructor(
        @Inject(COMPETITIONS) private readonly competitions: Competitions,
        @Inject(SUBMISSIONS) private readonly submissions: Submissions,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async execute(request: PublishCompetitionCommand): Promise<void> {
        const competition = await this.fetchCompetition(request.competitionId);
        competition.publish();
        await this.competitions.save(competition);

        const winner = await this.submissions.findWinnerInCompetition(competition.id);
        if (O.isSome(winner)) {
            this.eventEmitter.emit(WINNER_COMPUTED, new WinnerComputed(
                winner.value.competitionId.value,
                winner.value.participantId.value,
                new Date()
            ));
        }
    }

    private async fetchCompetition(id: string): Promise<Competition> {
        const competitionId = UID.fromString(id, "Invalid competition id.");
        if (E.isLeft(competitionId)) {
            throw new BadRequestException(competitionId.left.join("\n"));
        }
        
        const competition = await this.competitions.findById(competitionId.right);
        if (O.isNone(competition)) {
            throw new NotFoundException("Competition not found.");
        }
        return competition.value;
    }
}