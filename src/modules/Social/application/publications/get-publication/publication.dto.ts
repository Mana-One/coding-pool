export interface PublicationDto {
    id: string
    content: string
    postedIn: string | null
    createdAt: Date
    comments: number 
    likes: number 
    author: {
        id: string 
        username: string
    }
}