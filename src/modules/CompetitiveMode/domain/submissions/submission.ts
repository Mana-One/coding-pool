import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { UID } from "../../../../kernel/UID";

interface SubmissionProps {
    competitionId: string
    participantId: string 
    participant: string
    passed: boolean 
    time: number
}

export class Submission {
    private constructor(
        readonly competitionId: UID,
        readonly participantId: UID, 
        readonly participant: string,
        readonly passed: boolean, 
        readonly time: number,
    ) {}

    static create(props: SubmissionProps): E.Either<NEA.NonEmptyArray<string>, Submission> {
        return pipe(
            sequenceT(cumulativeValidation)(
                UID.fromString(props.competitionId, "Invalid competition id."),
                UID.fromString(props.participantId, "Invalid participant id."),
                E.of(props.participant),
                E.of(props.passed),
                E.of(props.time)
            ),
            E.map(args => new Submission(...args))
        );
    }

    static of(props: SubmissionProps): Submission {
        return new Submission(
            UID.of(props.competitionId),
            UID.of(props.participantId),
            props.participant,
            props.passed,
            props.time
        );
    }
}