import { IsString } from "class-validator";
import { PageRequest } from "../../../kernel/PageRequest";

export class ListProgramsRequest extends PageRequest {
    @IsString()
    authorId: string;
}