import { Option } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/uid";
import { LastProposition } from "./last-proposition";

export interface LastPropositions {
    findBy(competitionId: UID, participantId: UID): Promise<Option<LastProposition>>;
    save(lastProposition: LastProposition): Promise<void>;
}