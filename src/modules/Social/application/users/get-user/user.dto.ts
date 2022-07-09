export interface UserDto {
    id: string 
    username: string 
    picture: string | null
    memberSince: Date 
    isFollowing: boolean
    following: number 
    followers: number 
    programs: number 
    competitions_entered: number 
    competitions_won: number
}