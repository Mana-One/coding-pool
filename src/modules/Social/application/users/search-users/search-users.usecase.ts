import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { int } from "neo4j-driver";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { Usecase } from "../../../../../kernel/usecase";
import { SingleUserDto, UserList } from "../common/user-list";
import { SearchUsersQuery } from "./search-users.query";

@Injectable()
export class SearchUsersUsecase implements Usecase<SearchUsersQuery, UserList> {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: SearchUsersQuery): Promise<UserList> {
        if (request.username.length === 0) {
            throw new BadRequestException("Empty search field");
        }

        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const countResult = await transaction.run(
                "MATCH (user:User) WHERE user.username STARTS WITH $username\n" +
                "RETURN COUNT(user) as total", 
                { username: request.username }
            );
            const total = countResult.records[0].get("total").low;

            const row = await transaction.run(
                "MATCH (user:User) WHERE user.username STARTS WITH $username\n" +
                "CALL { WITH user RETURN EXISTS ((:User { id: $callerId })-[:FOLLOWS]->(user)) as isFollowing }\n" +
                "RETURN user, isFollowing\n" +
                "ORDER BY user.username\n" +
                "SKIP $offset LIMIT $limit",
                { username: request.username, limit: int(request.limit), offset: int(request.offset), callerId: request.callerId }
            );

            await transaction.commit();
            return new UserList(row.records.map(this.toDto), total, request.limit, request.offset);

        } catch(err) {
            await transaction.rollback();
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close()
        }
    }

    private toDto(data: any): SingleUserDto {
        return {
            id: data.get("user").properties.id,
            username: data.get("user").properties.username,
            picture: data.get("user").properties.picture || null,
            isFollowing: data.get("isFollowing")
        };
    }
}