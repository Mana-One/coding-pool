import { IsNotEmpty, IsString } from "class-validator";

export class CreatePublicationRequest {
    @IsString()
    @IsNotEmpty()
    content: string;
}