import { Page } from "../../../../kernel/Page";

export interface PublicationDto {
    id: string 
    content: string 
    createdAt: Date 
    author: {
        id: string 
        username: string
    }
}

export class Timeline extends Page<PublicationDto> {}