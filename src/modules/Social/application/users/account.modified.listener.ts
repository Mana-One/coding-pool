import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { AccountModified } from "../../../shared-kernel/account-modified.Event";
import { ACCOUNT_MODIFIED_EVENT } from "../../../shared-kernel/constants";

@Injectable()
export class AccountModifiedListener {
    private readonly logger = new Logger(AccountModifiedListener.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    @OnEvent(ACCOUNT_MODIFIED_EVENT)
    async create(event: AccountModified) {
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User { id: $id }) " +
            "SET u.username = $username",
            { id: event.userId, username: event.username }
        )
        .catch(err => this.logger.error(err))
        .finally(async () => await session.close());
    }
}