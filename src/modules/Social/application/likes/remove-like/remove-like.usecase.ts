import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import { isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { cumulativeValidation } from "../../../../../kernel/FpUtils";
import { UID } from "../../../../../kernel/UID";
import { Usecase } from "../../../../../kernel/Usecase";
import { WriteLikeCommand } from "../common/write-like.command";

@Injectable()
export class RemoveLikeUsecase implements Usecase<WriteLikeCommand, void> {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: WriteLikeCommand): Promise<void> {
        const { userId, publicationId } = this.validateRequest(request);

        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User { id: $userId })-[l:LIKED]->(p:Publication { id: $publicationId })\n" +
            "DELETE l",
            { userId: userId.value, publicationId: publicationId.value }
        )
        .catch(err => { throw new InternalServerErrorException(err instanceof Error ? err.message : String(err)); })
        .finally(async () => await session.close());
    }

    private validateRequest(request: WriteLikeCommand) {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                userId: UID.fromString(request.userId, "Invalid user id."),
                publicationId: UID.fromString(request.publicationId, "Invalid publication id.")
            })
        );
        if (isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        return result.right;
    }
}