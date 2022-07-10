import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/page-request";

export class SearchUsersRequest extends PageRequest {
    @IsString()
    username: string;
}