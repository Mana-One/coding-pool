import { Page } from "../../../../../kernel/Page";

export interface CommentDto {
    id: string 
    content: string 
    createdAt: Date 
    leftBy: {
        id: string 
        username: string
    }
}

export class CommentList extends Page<CommentDto> {}