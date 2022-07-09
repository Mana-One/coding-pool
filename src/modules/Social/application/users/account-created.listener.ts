import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { types } from "neo4j-driver";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { AccountCreated } from "../../../shared-kernel/account-created.event";
import { ACCOUNT_CREATED_EVENT } from "../../../shared-kernel/constants";

@Injectable()
export class AccountCreatedListener {
    private readonly logger = new Logger(AccountCreatedListener.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    @OnEvent(ACCOUNT_CREATED_EVENT)
    async create(event: AccountCreated) {
        const session = this.neo4jService.startSession();
        await session.run(
            "CREATE (u:User { id: $id, username: $username, picture: $picture, memberSince: $memberSince, programs: 0, competitions_entered: 0, competitions_won: 0})",
            { id: event.id, username: event.username, picture: event.picture, memberSince: types.DateTime.fromStandardDate(new Date()) }
        )
        .catch(err => this.logger.error(err))
        .finally(async () => await session.close());
    }
}