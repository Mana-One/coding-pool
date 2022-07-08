import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { CompetitionEntered } from "../../../shared-kernel/competition-entered.event";
import { COMPETITION_ENTERED } from "../../../shared-kernel/constants";

@Injectable()
export class CompetitionEnteredListener {
    private readonly logger = new Logger(CompetitionEnteredListener.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    @OnEvent(COMPETITION_ENTERED)
    async execute(event: CompetitionEntered) {
        const session = this.neo4jService.startSession();
        await session.run(
            "OPTIONAL MATCH (u: User { id: $id })\n" +
            "SET u.competitions_entered = u.competitions_entered + 1",
            { id: event.participantId }
        )
        .catch(err => this.logger.error(err))
        .finally(async () => await session.close());
    }
}