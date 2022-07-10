import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Entity } from "../../../../kernel/Entity";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { StringUtils } from "../../../../kernel/StringUtils";
import { UID } from "../../../../kernel/UID";
import { InvalidPublication } from "./errors";

interface PublicationProps {
    id: UID 
    content: string
    postedBy: UID 
    postedIn: O.Option<UID>
    createdAt: Date
}

type PublicationAttributes = Omit<PublicationProps, "id">;
interface PublicationCreation {
    content: string 
    postedBy: string
}

export class Publication extends Entity<UID, PublicationAttributes> {
    get content(): string { return this.props.content; }
    get postedBy(): UID { return this.props.postedBy; }
    get postedIn(): O.Option<UID> { return this.props.postedIn; }
    get createdAt(): Date { return this.props.createdAt; }

    static create(props: PublicationCreation): E.Either<InvalidPublication, Publication> {
        return pipe(
            sequenceS(cumulativeValidation)({
                content: StringUtils.minLength(1, "Empty publication.")(props.content),
                postedBy: UID.fromString(props.postedBy, "Invalid user id."),
                postedIn: E.of(O.none),
                createdAt: E.of(new Date())
            }),
            E.map(args => new Publication(UID.generate(), args)),
            E.mapLeft(InvalidPublication.fromMessages)
        );
    }

    static of(props: PublicationProps): Publication {
        return new Publication(props.id, props);
    }
}