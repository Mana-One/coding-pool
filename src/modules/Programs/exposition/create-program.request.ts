import { IsInt } from "class-validator";

export class CreateProgramRequest {
    @IsInt()
    languageId: number; 
}