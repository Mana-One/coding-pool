import { Type } from "class-transformer";
import { IsPositive, Min } from "class-validator";

export class PageRequest {
    @IsPositive()
    @Type(() => Number)
    limit: number;

    @Min(0)
    @Type(() => Number)
    offset: number;
}