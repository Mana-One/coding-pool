export class UserFollowed {
    constructor(
        readonly followee: string,
        readonly follower: string
    ) {}
}