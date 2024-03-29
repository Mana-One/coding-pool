import { Entity } from "../../../../kernel/Entity";
import { UID } from "../../../../kernel/UID";

interface UserProps {
    id: UID 
    username: string 
    memberSince: Date
}

type UserAttributes = Omit<UserProps, "id">;

export class User extends Entity<UID, UserAttributes> {
    get username(): string { return this.props.username; }
    get memberSince(): Date { return this.props.memberSince; }

    static of (props: UserProps): User {
        return new User(props.id, props);
    }
}