import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { PROGRAM_CREATED_EVENT } from "../../../shared-kernel/constants";
import { ProgramCreated } from "../../../shared-kernel/program-created.event";

@Injectable()
export class ProgramCreatedListener {
    private readonly logger = new Logger(ProgramCreatedListener.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    @OnEvent(PROGRAM_CREATED_EVENT)
    async execute(event: ProgramCreated) {
        const session = this.neo4jService.startSession();
        await session.run(
            "MERGE (u:User { id: $id })\n" +
            "ON MATCH SET u.programs = u.programs + 1",
            { id: event.authorId }
        )
        .catch(err => this.logger.error(err))
        .finally(async () => await session.close());
    }
}