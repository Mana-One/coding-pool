import { UID } from "../../../../kernel/UID";
import { Competition } from "../../domain/competitions/competition";
import { CompetitionModel } from "./competition.model";

export class CompetitionMapper {
    toPersistence(competition: Competition) {
        return {
            id: competition.id.value,
            title: competition.title,
            description: competition.description,
            startDate: competition.startDate,
            endDate: competition.endDate,
            languageId: competition.languageId,
            stdin: competition.stdin,
            expectedStdout: competition.expectedStdout
        };
    }

    toDomain(instance: CompetitionModel): Competition {
        return Competition.of({
            id: UID.of(instance.id),
            title: instance.title,
            description: instance.description,
            startDate: instance.startDate,
            endDate: instance.endDate,
            languageId: instance.languageId,
            stdin: instance.stdin,
            expectedStdout: instance.expectedStdout
        });
    }
}