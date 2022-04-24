import { Page } from "../../../../kernel/Page";

export interface SingleProgramDto {
    id: string 
    title: string
    createdAt: Date
}

export class Portfolio extends Page<SingleProgramDto> {}