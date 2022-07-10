import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { cumulativeValidation } from "../../../../kernel/fp-utils";
import { StringUtils } from "../../../../kernel/string-utils";
import { UID } from "../../../../kernel/uid"

interface LastPropositionProps {
    competitionId: string
    participantId: string 
    sourceCode: string
}

export class LastProposition {
    constructor(
        readonly competitionId: UID,
        readonly participantId: UID, 
        readonly sourceCode: string,
    ) {}

    static create(props: LastPropositionProps): E.Either<NEA.NonEmptyArray<string>, LastProposition> {
        return pipe(
            sequenceT(cumulativeValidation)(
                UID.fromString(props.competitionId, "Invalid competition id."),
                UID.fromString(props.participantId, "Invalid participant id."),
                StringUtils.minLength(1, "Source code is empty.")(props.sourceCode)
            ),
            E.map(args => new LastProposition(...args))
        );
    }

    static of(props: {
        competitionId: UID,
        participantId: UID,
        sourceCode: string
    }): LastProposition {
        return new LastProposition(props.competitionId, props.participantId, props.sourceCode);
    }
}