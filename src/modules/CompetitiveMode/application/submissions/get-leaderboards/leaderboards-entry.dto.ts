export interface LeaderboardsEntryDto {
    participant: {
        id: string 
        username: string 
    },
    competitionId: string,
    time: number,
    passed: boolean
}