import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import { Usecase } from "../../../../../kernel/usecase";
import { COMPETITIONS } from "../../../constants";
import { Competition } from "../../../domain/competitions/competition";
import { Competitions } from "../../../domain/competitions/competitions";
import { CreateCompetitionCommand } from "./create-competition.command";

@Injectable()
export class CreateCompetitionUsecase implements Usecase<CreateCompetitionCommand, void> {
    constructor(@Inject(COMPETITIONS) private readonly competitions: Competitions) {}

    async execute(request: CreateCompetitionCommand): Promise<void> {
        const [start, end] = [request.startDate, request.endDate]
            .sort((date1, date2) => date1.getTime() - date2.getTime());
        if (start.getTime() <= Date.now()) {
            throw new BadRequestException("Start date cannot be before current time.");
        }

        const competition = Competition.createCompetition({
            ...request,
            startDate: start,
            endDate: end
        });
        if (E.isLeft(competition)) {
            throw competition.left;
        }
        
        await this.competitions.save(competition.right);
    }
}