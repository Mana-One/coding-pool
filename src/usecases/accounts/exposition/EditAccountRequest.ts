import { IsEmail, IsString, ValidateIf } from "class-validator";

export class EditAccountRequest {
    @IsString()
    username: string; 

    @ValidateIf(o => o.wallet !== null)
    @IsString()
    wallet: string | null;
    
    @IsEmail()
    email: string;
}