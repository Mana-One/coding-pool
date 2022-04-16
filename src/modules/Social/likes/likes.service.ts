import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { UID } from "../../../kernel/UID";
import { LIKES } from "./constants";
import { WriteLikeDto } from "./dtos/write-like.dto";
import { Likes } from "./likes.db";

@Injectable()
export class LikesService {
    constructor(@Inject(LIKES) private readonly likesDao: Likes) {}

    async create(command: WriteLikeDto): Promise<void> {
        const input = this.checkInput(command);
        await this.likesDao.create(input.userId, input.publicationId);
    }

    async remove(command: WriteLikeDto): Promise<void> {
        const input = this.checkInput(command);
        await this.likesDao.remove(input.userId, input.publicationId);
    }



    private checkInput(command: WriteLikeDto) {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                userId: UID.fromString(command.userId, "Invalid user id."),
                publicationId: UID.fromString(command.publicationId, "Invalid publication id.")
            })
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        return result.right;
    }
}