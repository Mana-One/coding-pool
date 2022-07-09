export class AccountModified {
    constructor(
        readonly userId: string,
        readonly username: string,
        readonly email: string,
        readonly picture: string | null
    ) {}
}