import { sequenceS } from "fp-ts/lib/Apply";
import { Either, fromPredicate, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray, of } from "fp-ts/lib/NonEmptyArray";
import { Entity } from "../../../kernel/Entity";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";

interface ProgramProps {
    id: UID
    content: string
    languageId: number
    authorId: UID
}

export class Program extends Entity<UID, Omit<ProgramProps, "id">> {
    get content(): string { return this.props.content }
    get languageId(): number { return this.props.languageId; }
    get authorId(): UID { return this.props.authorId }

    replaceContent(content: string): Either<NonEmptyArray<string>, void> {
        return pipe(
            StringUtils.maxLength(50_000, "Program body too long.")(content),
            map(arg => { this.props.content = arg; }),
        );        
    }

    static create(props: {
        authorId: string
        languageId: number
    }): Either<NonEmptyArray<string>, Program> {
        return pipe(
            sequenceS(cumulativeValidation)({
                authorId: UID.fromString(props.authorId, "Invalid author id."),
                languageId: fromPredicate(
                    (n: number) => Number.isInteger(n) && n >= 0,
                    () => of("Language id must be a positive integer")
                )(props.languageId)
            }),
            map(args => new Program(UID.generate(), {
                ...args,
                content: ""
            }))
        );
    }

    static of(props: ProgramProps): Program {
        return new Program(props.id, props);
    }
}