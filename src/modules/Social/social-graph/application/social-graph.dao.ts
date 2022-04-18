import { UID } from "../../../../kernel/UID";

export interface SocialGraphDao {
    addFollowRelationship(follower: UID, followee: UID): Promise<void>;
    addUser(id: UID, username: string): Promise<void>;
}