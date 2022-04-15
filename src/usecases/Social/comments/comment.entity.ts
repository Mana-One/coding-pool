import { Entity } from "../../../kernel/Entity";
import { UID } from "../../../kernel/UID";

interface CommentProps {
    id: UID 
    content: string 
    createdAt: Date
    userId: UID 
    publicationId: UID
}

type CommentAttributes = Omit<CommentProps, "id">;
type CommentCreation = Omit<CommentProps, "id">;

export class Comment extends Entity<UID, CommentAttributes> {
    get content(): string { return this.props.content; }
    get createdAt(): Date { return this.props.createdAt; }
    get userId(): UID { return this.props.userId; }
    get publicationId(): UID { return this.props.publicationId; }

    static create(props: CommentCreation): Comment {
        return new Comment(UID.generate(), props);
    }
}