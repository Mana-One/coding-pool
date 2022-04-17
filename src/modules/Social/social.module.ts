import { Module } from "@nestjs/common";
import { CommentsModule } from "./comments/comments.module";
import { LikesModule } from "./likes/likes.module";
import { PublicationsModule } from "./publications/publications.module";
import { UserStatsModule } from "./user-stats/user-stats.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [UsersModule, PublicationsModule, CommentsModule, LikesModule, UserStatsModule]
})
export class SocialModule {}