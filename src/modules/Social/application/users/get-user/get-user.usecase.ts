import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { GetUserQuery } from "./get-user.query";
import { UserDto } from "./user.dto";

@Injectable()
export class GetUserUsecase {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: GetUserQuery): Promise<UserDto> {
        const session = this.neo4jService.startSession();
        const row = await session.run(
            "MATCH (user:User { id: $userId })\n" +
            "OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(user)\n" +
            "OPTIONAL MATCH (user)-[:FOLLOWS]->(followee:User)\n" +

            "RETURN user, " + 
            "COUNT(DISTINCT(follower)) as followers, " +
            "COUNT(DISTINCT(followee)) as following, " +
            "EXISTS ((:User { id: $callerId })-[:FOLLOWS]->(user)) as isFollowing",
            { userId: request.userId, callerId: request.callerId }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());

        if (row.records.length === 0) {
            throw new NotFoundException("User not found");
        }
        
        return this.toDto(row.records[0]);
    }

    private toDto(data: any): UserDto {
        const user = data.get("user");
        const followers = data.get("followers").low;
        const following = data.get("following").low;
        const isFollowing = data.get("isFollowing");
    
        return {
            id: user.properties.id,
            username: user.properties.username,
            picture: user.properties.picture || null,
            memberSince: Neo4jService.parseDate(user.properties.memberSince),
            isFollowing,
            followers,
            following,
            programs: user.properties.programs.low,
            competitions_entered: user.properties.competitions_entered.low,
            competitions_won: user.properties.competitions_won.low
        };
    }
}