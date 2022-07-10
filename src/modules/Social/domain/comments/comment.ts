import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { Entity } from "../../../../kernel/entity";
import { cumulativeValidation } from "../../../../kernel/fp-utils";
import { StringUtils } from "../../../../kernel/string-utils";
import { UID } from "../../../../kernel/uid";

interface CommentProps {
    id: UID 
    content: string 
    createdAt: Date
    userId: UID 
    publicationId: UID
}

type CommentAttributes = Omit<CommentProps, "id">;

export class Comment extends Entity<UID, CommentAttributes> {
    get content(): string { return this.props.content; }
    get createdAt(): Date { return this.props.createdAt; }
    get userId(): UID { return this.props.userId; }
    get publicationId(): UID { return this.props.publicationId; }

    static create(props: {
        content: string 
        userId: string 
        publicationId: string 
    }): E.Either<NEA.NonEmptyArray<string>, Comment> {
        return pipe(
            sequenceS(cumulativeValidation)({
                content: StringUtils.minLength(1, "Empty comment.")(props.content),
                createdAt: E.of(new Date()),
                userId: UID.fromString(props.userId, "Invalid user id."),
                publicationId: UID.fromString(props.publicationId, "Invalid publication id.")
            }),
            E.map(args => new Comment(UID.generate(), args))
        );
    }
}