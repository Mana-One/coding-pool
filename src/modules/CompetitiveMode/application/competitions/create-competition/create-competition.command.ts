export interface CreateCompetitionCommand {
    title: string 
    description: string 
    startDate: Date 
    endDate: Date
    languageId: number 
    stdin: string 
    expectedStdout: string 
}