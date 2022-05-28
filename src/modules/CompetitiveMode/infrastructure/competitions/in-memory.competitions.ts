import { Injectable } from "@nestjs/common";
import { string } from "fp-ts";
import { Option } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/UID";
import { Competition } from "../../domain/competitions/competition";
import { Competitions } from "../../domain/competitions/competitions";

@Injectable()
export class InMemoryCompetitions implements Competitions {
    private data: Map<string, Competition> = new Map();

    findById(id: UID): Promise<Option<Competition>> {
        throw new Error("Method not implemented.");
    }

    async save(entity: Competition): Promise<void> {
        this.data.set(entity.id.value, entity);
    }
}