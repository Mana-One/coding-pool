import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}