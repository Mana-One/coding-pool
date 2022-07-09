export class AccountCreated {
    constructor(
        readonly id: string,
        readonly username: string,
        readonly picture: string | null
    ) {}
}