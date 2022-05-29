export interface ReceiveSubmissionCommand {
    competitionId: string
    participantId: string 
    participant: string
    passed: boolean 
    time: number
}