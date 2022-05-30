import { IsInt, IsString } from "class-validator"

export class Judge0StatusRequest {
    @IsInt()
    id: number 
    
    @IsString()
    description: string
}