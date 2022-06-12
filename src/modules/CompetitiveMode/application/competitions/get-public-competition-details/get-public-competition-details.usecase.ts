import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Usecase } from "../../../../../kernel/Usecase";
import { CompetitionModel } from "../../../infrastructure/competitions/competition.model";
import { PublicCompetitionDetails } from "./public-competition-details.dto";

@Injectable()
export class GetPublicCompetitionDetailsUsecase implements Usecase<string, PublicCompetitionDetails> {
    async execute(request: string): Promise<PublicCompetitionDetails> {
        const row = await CompetitionModel.findByPk(request, {
            attributes: {
                exclude: ["stdin", "expectedStdout"]
            }
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });

        if (row === null) {
            throw new NotFoundException("Competition not found.");
        }
        return this.toDto(row);
    }

    private toDto(instance: CompetitionModel): PublicCompetitionDetails {
        return {
            id: instance.id,
            title: instance.title,
            description: instance.description,
            languageId: instance.languageId,
            startDate: instance.startDate,
            endDate: instance.endDate
        };
    }
}