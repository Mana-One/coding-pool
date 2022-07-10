import { Page } from "../../../../../kernel/page"

export interface SingleUserDto {
    id: string 
    username: string
    picture: string | null
    isFollowing: boolean
}

export class UserList extends Page<SingleUserDto> {}