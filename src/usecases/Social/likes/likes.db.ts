import { UID } from "../../../kernel/UID";

export interface Likes {
    create(userId: UID, publicationId: UID): Promise<void>;
    remove(userId: UID, publicationId: UID): Promise<void>;
}