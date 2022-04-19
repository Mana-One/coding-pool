export class UserUnfollowed {
    constructor(
        readonly followee: string,
        readonly follower: string
    ) {}
}