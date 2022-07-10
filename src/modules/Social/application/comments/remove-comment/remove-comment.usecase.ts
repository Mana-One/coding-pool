import { Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../../../kernel/fp-utils";
import { UID } from "../../../../../kernel/uid";
import { COMMENTS } from "../../../constants";
import { Comments } from "../../../domain/comments/comments";
import { InvalidComment } from "../../../domain/comments/errors";
import { RemoveCommentCommand } from "./remove-comment.command";

@Injectable()
export class RemoveCommentUsecase {
    constructor(@Inject(COMMENTS) private readonly comments: Comments) {}

    async execute(request: RemoveCommentCommand): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                commentId: UID.fromString(request.commentId, "Invalid comment id."),
                userId: UID.fromString(request.userId, "Invalid user id.")
            })
        );
        if (E.isLeft(result)) {
            throw InvalidComment.fromMessages(result.left);
        }
        const { commentId, userId } = result.right;
        await this.comments.removeBy(commentId, userId);
    }
}