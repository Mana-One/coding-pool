import { Page } from "../../../../kernel/Page";

export interface SingleProgramDto {
    id: string 
    title: string
}

export class Portfolio extends Page<SingleProgramDto> {}