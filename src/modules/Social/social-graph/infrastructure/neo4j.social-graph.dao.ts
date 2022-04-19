import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../../kernel/UID";
import { SocialGraphDao } from "../application/social-graph.dao";

@Injectable()
export class Neo4jSocialGraphDao implements SocialGraphDao {
    constructor(private readonly neo4jService: Neo4jService) {}

    async addFollowRelationship(follower: UID, followee: UID): Promise<void> {
        const session = this.neo4jService.startSession();
        try {
            await session.run(
                "MATCH (followee:User), (follower:User)\n" + 
                "WHERE followee.id = $followeeId AND follower.id = $followerId\n" +
                "MERGE (follower)-[f:FOLLOWS]->(followee)",
                { followeeId: followee.value, followerId: follower.value }
            );

        } catch(err) {
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }

    async addUser(id: UID, username: string): Promise<void> {
        const session = this.neo4jService.startSession();
        try {
            await session.run(
                "MERGE (u:User { id: $id, username: $username })",
                { id: id.value, username }
            );

        } catch(err) {
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }     
    }

    async removeFollowRelationShip(follower: UID, followee: UID): Promise<void> {
        const session = this.neo4jService.startSession();
        try {
            const result = await session.run(
                "MATCH (follower:User { id: $followerId })-[f:FOLLOWS]->(followee:User { id: $followeeId })\n" +
                "DELETE f",
                { followeeId: followee.value, followerId: follower.value }
            );

            if (result.summary.updateStatistics.updates().relationshipsDeleted === 0) {
                throw new NotFoundException("Follow relationship not found.");
            }

        } catch(err) {
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }
}