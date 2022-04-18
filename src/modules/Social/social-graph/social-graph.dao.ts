import { UID } from "../../../kernel/UID";

export interface SocialGraphDao {
    addFollowRelationship(follower: UID, followee: UID): Promise<void>;
}