export class Role {
    static readonly USER = new Role("user");
    static readonly ADMIN = new Role("admin");

    private constructor(readonly name: string) {}

    static of(name: string): Role {
        if (name === Role.USER.name) {
            return Role.USER;
        }
        return Role.ADMIN;
    }
}