export interface PublicationDto {
    id: string
    content: string
    postedIn: string | null
    createdAt: Date
    comments: number 
    likes: number 
    isLiked: boolean
    author: {
        id: string 
        username: string
        picture: string | null
    }
}