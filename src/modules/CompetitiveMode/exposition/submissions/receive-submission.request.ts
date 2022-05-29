import { Type } from "class-transformer";
import { IsInt, IsNumberString } from "class-validator"

export class ReceiveSubmissionRequest {
    @IsInt()
    status: number;
    
    @Type(() => Number)
    @IsNumberString()
    time: number;
}