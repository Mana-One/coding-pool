import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/page-request";

export class ListCompetitionsRequest extends PageRequest {
    @IsString()
    status: string;
}