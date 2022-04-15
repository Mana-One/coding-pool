import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordRequest {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;  
}