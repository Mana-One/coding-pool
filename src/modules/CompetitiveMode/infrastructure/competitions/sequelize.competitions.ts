import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { Competition } from "../../domain/competitions/competition";
import { Competitions } from "../../domain/competitions/competitions";
import { CompetitionMapper } from "./competition.mapper";
import { CompetitionModel } from "./competition.model";

@Injectable()
export class SequelizeCompetitions implements Competitions {
    constructor(private readonly mapper: CompetitionMapper) {}

    async findById(id: UID): Promise<O.Option<Competition>> {
        const instance = await CompetitionModel.findByPk(id.value)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        if (instance === null) {
            return O.none;
        }
        return O.some(this.mapper.toDomain(instance));
    }

    async save(entity: Competition): Promise<void> {
        await CompetitionModel.upsert(this.mapper.toPersistence(entity))
            .catch(err => { throw new InternalServerErrorException(String(err)); });
    }
}