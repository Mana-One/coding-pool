import { IsInt, IsString } from "class-validator";

export class CreateProgramRequest {
    @IsString()
    title: string; 

    @IsInt()
    languageId: number; 
}