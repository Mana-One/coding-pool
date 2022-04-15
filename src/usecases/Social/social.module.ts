import { Module } from "@nestjs/common";
import { CommentsModule } from "./comments/comments.module";
import { PublicationsModule } from "./publications/publications.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [UsersModule, PublicationsModule, CommentsModule]
})
export class SocialModule {}