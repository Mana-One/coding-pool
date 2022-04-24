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
    title: string
    content: string
    languageId: number
    authorId: UID
}

export class Program extends Entity<UID, Omit<ProgramProps, "id">> {
    get title(): string { return this.props.title; }
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
        title: string
        authorId: string
        languageId: number
    }): Either<NonEmptyArray<string>, Program> {
        return pipe(
            sequenceS(cumulativeValidation)({
                title: StringUtils.lengthBetween(1, 100, "Program title length must be between 1-100")(props.title),
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