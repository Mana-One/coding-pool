export interface CodeJudge {
    send(input: {
        competitionId: string 
        participantId: string 
        participant: string
        source_code: string 
        stdin: string 
        expectedStdout: string
    }): Promise<{ token: string }>
}