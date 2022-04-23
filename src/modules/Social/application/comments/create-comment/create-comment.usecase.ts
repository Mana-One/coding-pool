import { Inject, Injectable } from "@nestjs/common";
import { isLeft } from "fp-ts/lib/Either";
import { COMMENTS } from "../../../constants";
import { Comment } from "../../../domain/comments/comment";
import { Comments } from "../../../domain/comments/comments";
import { InvalidComment } from "../../../domain/comments/errors";
import { CreateCommentCommand } from "./create-comment.command";

@Injectable()
export class CreateCommentUsecase {
    constructor(@Inject(COMMENTS) private readonly comments: Comments) {}

    async execute(request: CreateCommentCommand): Promise<void> {
        const comment = Comment.create(request);
        if (isLeft(comment)) {
            throw InvalidComment.fromMessages(comment.left);
        }
        await this.comments.save(comment.right);
    }
}