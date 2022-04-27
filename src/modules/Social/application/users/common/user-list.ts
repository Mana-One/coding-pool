import { Page } from "../../../../../kernel/Page"

export interface SingleUserDto {
    id: string 
    username: string
}

export class UserList extends Page<SingleUserDto> {}