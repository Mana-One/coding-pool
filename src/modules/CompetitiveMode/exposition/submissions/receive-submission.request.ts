import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator"
import { Judge0StatusRequest } from "./judge0-status.request";

export class ReceiveSubmissionRequest {
    @ValidateNested()
    @Type(() => Judge0StatusRequest)
    status: Judge0StatusRequest;

    @IsNumber()
    @Type(() => Number)
    time: number;
}