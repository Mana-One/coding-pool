import { IsNotEmpty, IsString } from "class-validator";

export class PublicationCreationRequest {
    @IsString()
    @IsNotEmpty()
    content: string;
}