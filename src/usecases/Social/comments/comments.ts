import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/UID";
import { Comment } from "./comment.entity";

export interface Comments extends Repository<UID, Comment> {
    removeBy(id: UID, userId: UID): Promise<void>;
}