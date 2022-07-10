import { Page } from "../../../../../kernel/page";

export interface PublicationDto {
    id: string 
    content: string 
    createdAt: Date 
    likes: number 
    comments: number
    isLiked: boolean
    author: {
        id: string 
        username: string
        picture: string | null
    }
}

export class Timeline extends Page<PublicationDto> {}