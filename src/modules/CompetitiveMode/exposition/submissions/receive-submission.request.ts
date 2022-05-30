import { Type } from "class-transformer";
import { IsInt, IsNumberString, IsString, ValidateNested } from "class-validator"
import { Judge0StatusRequest } from "./judge0-status.request";

export class ReceiveSubmissionRequest {
    @ValidateNested()
    status: Judge0StatusRequest;

    @IsString()
    stdout: string;

    @IsString()
    expected_output: string;
    
    @Type(() => Number)
    @IsNumberString()
    time: number;
}