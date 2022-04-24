import { IsString } from "class-validator";

export class ReplaceContentRequest {
    @IsString()
    content: string;
}