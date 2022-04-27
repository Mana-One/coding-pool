import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/PageRequest";

export class SearchUsersRequest extends PageRequest {
    @IsString()
    username: string;
}