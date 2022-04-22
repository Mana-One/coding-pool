import { IsString } from "class-validator";
import { PageRequest } from "../../../../kernel/PageRequest";

export class ListCommentsRequest extends PageRequest {
    @IsString()
    publicationId: string; 
}