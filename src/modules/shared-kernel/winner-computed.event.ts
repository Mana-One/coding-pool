export class WinnerComputed {
    constructor(
        readonly competitionId: string,
        readonly winnerId: string,
        readonly determinedAt: Date
    ) {}
}