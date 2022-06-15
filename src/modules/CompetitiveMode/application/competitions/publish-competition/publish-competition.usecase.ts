import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../../kernel/UID";
import { Usecase } from "../../../../../kernel/Usecase";
import { COMPETITIONS } from "../../../constants";
import { Competition } from "../../../domain/competitions/competition";
import { Competitions } from "../../../domain/competitions/competitions";
import { PublishCompetitionCommand } from "./publish-competition.command";

@Injectable()
export class PublishCompetitionUsecase implements Usecase<PublishCompetitionCommand, void> {
    constructor(@Inject(COMPETITIONS) private readonly competitions: Competitions) {}

    async execute(request: PublishCompetitionCommand): Promise<void> {
        const competition = await this.fetchCompetition(request.competitionId);
        competition.publish();
        await this.competitions.save(competition);
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