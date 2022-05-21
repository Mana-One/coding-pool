import { IsEmail, IsString } from "class-validator";

export class EditAccountRequest {
    @IsString()
    username: string; 
    
    @IsEmail()
    email: string;
}