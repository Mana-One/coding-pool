import { Option } from "fp-ts/lib/Option";
import { Entity } from "../../../kernel/Entity";
import { UID } from "../../../kernel/UID";

interface PublicationProps {
    id: UID 
    content: string
    postedBy: UID 
    postedIn: Option<UID>
    createdAt: Date
}

type PublicationAttributes = Omit<PublicationProps, "id">;
type PublicationCreation = Omit<PublicationProps, "id">;

export class Publication extends Entity<UID, PublicationAttributes> {
    get content(): string { return this.props.content; }
    get postedBy(): UID { return this.props.postedBy; }
    get postedIn(): Option<UID> { return this.props.postedIn; }
    get createdAt(): Date { return this.props.createdAt; }

    static create(props: PublicationCreation): Publication {
        return new Publication(UID.generate(), props);
    }
}