import { Either, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { Entity } from "../../../kernel/Entity";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";

interface ProgramProps {
    id: UID
    content: string
    authorId: UID
}

export class Program extends Entity<UID, Omit<ProgramProps, "id">> {
    get content(): string { return this.props.content }
    get authorId(): UID { return this.props.authorId }

    replaceContent(content: string): Either<NonEmptyArray<string>, void> {
        return pipe(
            StringUtils.maxLength(50_000, "Program body too long.")(content),
            map(arg => { this.props.content = arg; }),
        );        
    }

    static create(props: {
        authorId: string
    }): Either<NonEmptyArray<string>, Program> {
        return pipe(
            UID.fromString(props.authorId, "Invalid author id."),
            map(arg => new Program(UID.generate(), {
                content: "",
                authorId: arg
            }))
        );
    }

    static of(props: ProgramProps): Program {
        return new Program(props.id, props);
    }
}