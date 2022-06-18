import { Page } from "../../../../../kernel/Page"

export interface SingleUserDto {
    id: string 
    username: string
    isFollowing: boolean
}

export class UserList extends Page<SingleUserDto> {}