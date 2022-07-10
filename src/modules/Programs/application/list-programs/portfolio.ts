import { Page } from "../../../../kernel/page";

export interface SingleProgramDto {
    id: string 
    title: string
    createdAt: Date
}

export class Portfolio extends Page<SingleProgramDto> {}