import { Module } from "@nestjs/common";
import { PublicationsModule } from "./publications/publications.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [UsersModule, PublicationsModule]
})
export class SocialModule {}