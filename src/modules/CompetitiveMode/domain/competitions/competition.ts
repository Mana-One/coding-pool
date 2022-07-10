import { BadRequestException } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import { Entity } from "../../../../kernel/Entity";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { StringUtils } from "../../../../kernel/StringUtils";
import { UID } from "../../../../kernel/UID";
import { InvalidCompetition } from "./errors";

interface CompetitionProps {
    id: UID 
    title: string 
    description: string 
    startDate: Date 
    endDate: Date
    languageId: number 
    stdin: string 
    expectedStdout: string 
}

type CompetitionAttributes = Omit<CompetitionProps, "id">;

export class Competition extends Entity<UID, CompetitionAttributes> {
    private static readonly C_ID = 1;
    private static readonly FSHARP_ID = 24;

    get title(): string { return this.props.title; }
    get description(): string { return this.props.description; }
    get startDate(): Date { return this.props.startDate; }
    get endDate(): Date { return this.props.endDate; }
    get languageId(): number { return this.props.languageId; }
    get stdin(): string { return this.props.stdin; }
    get expectedStdout(): string { return this.props.expectedStdout; }

    isCurrent(now: Date): boolean {
        return now.getTime() <= this.startDate.getTime() && this.endDate.getTime() <= now.getTime();
    }

    static createCompetition(props: {
        title: string 
        description: string 
        startDate: Date 
        endDate: Date 
        languageId: number 
        stdin: string 
        expectedStdout: string 
    }): E.Either<InvalidCompetition, Competition> {
        return pipe(
            sequenceS(cumulativeValidation)({
                title: StringUtils.minLength(1, "Invalid title")(props.title),
                description: StringUtils.minLength(1, "Invalid description")(props.description),
                startDate: E.of(props.startDate),
                endDate: E.of(props.endDate),
                languageId: E.fromPredicate(
                    (n: number) => n === Competition.C_ID || n === Competition.FSHARP_ID,
                    () => NEA.of("Invalid language id.")
                )(props.languageId),
                stdin: StringUtils.minLength(1, "Invalid stdin.")(props.stdin),
                expectedStdout: StringUtils.minLength(1, "Invalid expected stdout.")(props.expectedStdout)
            }),
            E.map(data => new Competition(UID.generate(), data)),
            E.mapLeft(InvalidCompetition.fromMessages)
        )
    }
    
    static of(props: CompetitionProps): Competition {
        return new Competition(props.id, props);
    }
}