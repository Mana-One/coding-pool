import { Page } from "../../../../../kernel/page";

export interface CommentDto {
    id: string 
    content: string 
    createdAt: Date 
    leftBy: {
        id: string 
        username: string
        picture: string | null
    }
}

export class CommentList extends Page<CommentDto> {}