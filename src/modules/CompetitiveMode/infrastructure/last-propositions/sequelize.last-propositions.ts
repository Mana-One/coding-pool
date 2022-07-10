import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/uid";
import { LastProposition } from "../../domain/last-proposition/last-proposition";
import { LastPropositions } from "../../domain/last-proposition/last-propositions";
import { LastPropositionModel } from "./last-proposition.model";

@Injectable()
export class SequelizeLastPropositions implements LastPropositions {
    async findBy(competitionId: UID, participantId: UID): Promise<O.Option<LastProposition>> {
        const instance = await LastPropositionModel.findOne({
            where: {
                competitionId: competitionId.value,
                participantId: participantId.value
            }
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });

        if(instance === null) {
            return O.none;
        }
        return O.some(this.toDomain(instance));
    }

    async save(lastProposition: LastProposition): Promise<void> {
        await LastPropositionModel.upsert({
            competitionId: lastProposition.competitionId.value,
            participantId: lastProposition.participantId.value,
            sourceCode: lastProposition.sourceCode
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });
    }

    private toDomain(instance: LastPropositionModel): LastProposition {
        return LastProposition.of({
            competitionId: UID.of(instance.competitionId),
            participantId: UID.of(instance.participantId),
            sourceCode: instance.sourceCode
        });
    }
}