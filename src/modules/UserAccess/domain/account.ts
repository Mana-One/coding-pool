import { Option } from "fp-ts/lib/Option";
import { Entity } from "../../../kernel/Entity";
import { UID } from "../../../kernel/UID";
import { Email } from "./email";
import { Password } from "./password";
import { Role } from "./role";

interface AccountProps {
    id: UID
    username: string
    email: Email
    password: Password
    role: Role
}

type AccountEntityProps = Omit<AccountProps, "id">;
type AccountCreation = Omit<AccountProps, "id" | "role">;
type AccountEdition = Pick<AccountProps, "username" | "email">;

export class Account extends Entity<UID, AccountEntityProps> {
    get username(): string { return this.props.username; }
    get email(): Email { return this.props.email; }
    get password(): Password { return this.props.password; }
    get role(): Role { return this.props.role; }

    changePassword(password: Password): void {
        this.props.password = password;
    }

    editAccount(props: AccountEdition): void {
        this.props.username = props.username;
        this.props.email = props.email;
    }

    static createUser(props: AccountCreation): Account {
        return new Account(UID.generate(), {
            ...props,
            role: Role.USER
        });
    }

    static createAdmin(props: AccountCreation): Account {
        return new Account(UID.generate(), {
            ...props,
            role: Role.ADMIN
        });
    }

    static of(props: AccountProps): Account {
        return new Account(props.id, props);
    }
}