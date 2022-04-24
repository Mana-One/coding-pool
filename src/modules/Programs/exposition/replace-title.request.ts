import { IsString } from "class-validator";

export class ReplaceTitleRequest {
    @IsString()
    title: string;
}