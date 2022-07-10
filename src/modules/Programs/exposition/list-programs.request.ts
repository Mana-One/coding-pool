import { IsString } from "class-validator";
import { PageRequest } from "../../../kernel/page-request";

export class ListProgramsRequest extends PageRequest {
    @IsString()
    authorId: string;
}