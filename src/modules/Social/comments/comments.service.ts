import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";
import { Comment } from "./comment.entity";
import { Comments } from "./comments";
import { COMMENTS } from "./constants";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { RemoveCommentCommand } from "./dtos/remove-comment.command";
import { InvalidComment } from "./errors";

@Injectable()
export class CommentsService {
    constructor(@Inject(COMMENTS) private readonly comments: Comments) {}

    async create(command: CreateCommentDto): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                content: StringUtils.minLength(1, "Empty comment.")(command.content),
                createdAt: E.of(new Date()),
                userId: UID.fromString(command.userId, "Invalid user id."),
                publicationId: UID.fromString(command.publicationId, "Invalid publication id.")
            }),
            E.map(props => Comment.create(props))
        );
        if (E.isLeft(result)) {
            throw InvalidComment.fromMessages(result.left);
        }

        await this.comments.save(result.right);
    }

    async remove(command: RemoveCommentCommand): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                commentId: UID.fromString(command.commentId, "Invalid comment id."),
                userId: UID.fromString(command.userId, "Invalid user id.")
            })
        );
        if (E.isLeft(result)) {
            throw new BadRequestException(result.left.join("\n"));
        }
        const input = result.right;
        await this.comments.removeBy(input.commentId, input.userId);
    }
}