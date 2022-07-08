import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { WINNER_COMPUTED } from "../../../shared-kernel/constants";
import { WinnerComputed } from "../../../shared-kernel/winner-computed.event";

@Injectable()
export class WinnerComputedListener {
    private readonly logger = new Logger(WinnerComputedListener.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    @OnEvent(WINNER_COMPUTED)
    async execute(event: WinnerComputed) {
        const session = this.neo4jService.startSession();
        await session.run(
            "OPTIONAL MATCH (u: User { id: $id })\n" +
            "SET u.competitions_won = u.competitions_won + 1",
            { id: event.winnerId }
        )
        .catch(err => this.logger.error(err))
        .finally(async () => await session.close());
    }
}