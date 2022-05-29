import { IsString } from "class-validator";

export class CreateSubmissionRequest {
    @IsString()
    source_code: string;
}