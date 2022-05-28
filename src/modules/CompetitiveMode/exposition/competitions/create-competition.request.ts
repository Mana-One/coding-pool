import { Type } from "class-transformer"
import { IsDate, IsInt, IsString, Min } from "class-validator"

export class CreateCompetitionRequest {
    @IsString()
    title: string 
    
    @IsString()
    description: string 

    @Type(() => Date)
    @IsDate()
    startDate: Date 

    @Type(() => Date)
    @IsDate()
    endDate: Date

    @Min(0)
    @IsInt()
    languageId: number 

    @IsString()
    stdin: string 

    @IsString()
    expectedStdout: string 
}