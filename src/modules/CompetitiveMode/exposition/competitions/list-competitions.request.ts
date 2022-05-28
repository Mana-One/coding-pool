import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/PageRequest";

export class ListCompetitionsRequest extends PageRequest {
    @IsString()
    status: string;
}