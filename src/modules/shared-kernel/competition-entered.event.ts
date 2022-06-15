export class CompetitionEntered {
    constructor(
        readonly competitionId: string,
        readonly participantId: string,
        readonly enteredAt: Date
    ) {}
}