import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class EditAccountRequest {
    @IsString()
    username: string; 
    
    @IsEmail()
    email: string;
}