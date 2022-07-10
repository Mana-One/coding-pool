import { Repository } from "../../../../kernel/repository";
import { UID } from "../../../../kernel/uid";
import { Comment } from "./comment";

export interface Comments extends Repository<UID, Comment> {
    removeBy(id: UID, userId: UID): Promise<void>;
}