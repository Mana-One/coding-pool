import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import { isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { cumulativeValidation } from "../../../../../kernel/FpUtils";
import { UID } from "../../../../../kernel/UID";
import { Usecase } from "../../../../../kernel/Usecase";
import { FollowCommand } from "../common/follow.command";

@Injectable()
export class UnfollowUserUsecase implements Usecase<FollowCommand, void> {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: FollowCommand): Promise<void> {
        const { followee, follower } = this.validateRequest(request);
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (follower:User { id: $followerId })-[f:FOLLOWS]->(followee:User { id: $followeeId })\n" +
            "DELETE f",
            { followeeId: followee.value, followerId: follower.value }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => { await session.close(); });
    }

    private validateRequest(request: FollowCommand) {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                follower: UID.fromString(request.follower, "Invalid follower id."),
                followee: UID.fromString(request.followee, "Invalid followee id.")
            })
        );
        if (isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        return result.right;
    }
}