import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/page-request";

export class ListCommentsRequest extends PageRequest {
    @IsString()
    publicationId: string; 
}