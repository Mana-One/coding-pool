export class Role {
    static readonly USER = new Role("user");
    static readonly ADMIN = new Role("admin");

    private constructor(readonly name: string) {}

    equals(other: object): boolean {
        if (other === null || other === undefined || !(other instanceof Role)) {
            return false;
        }
        return this.name === other.name;
    }

    static of(name: string): Role {
        if (name === Role.USER.name) {
            return Role.USER;
        }
        return Role.ADMIN;
    }
}