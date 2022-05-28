import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { Competition } from "../../domain/competitions/competition";
import { Competitions } from "../../domain/competitions/competitions";
import { CompetitionMapper } from "./competition.mapper";
import { CompetitionModel } from "./competition.model";

@Injectable()
export class SequelizeCompetitions implements Competitions {
    constructor(private readonly mapper: CompetitionMapper) {}

    findById(id: UID): Promise<Option<Competition>> {
        throw new Error("Method not implemented.");
    }

    async save(entity: Competition): Promise<void> {
        await CompetitionModel.upsert(this.mapper.toPersistence(entity))
            .catch(err => { throw new InternalServerErrorException(String(err)); });
    }
}