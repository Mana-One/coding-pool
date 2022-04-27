import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { Usecase } from "../../../../../kernel/Usecase";
import { GetPublicationQuery } from "./get-publication.query";
import { PublicationDto } from "./publication.dto";

@Injectable()
export class GetPublicationUsecase implements Usecase<GetPublicationQuery, PublicationDto> {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: GetPublicationQuery): Promise<PublicationDto> {
        const session = this.neo4jService.startSession();

        return await session.run(
            "MATCH (publication:Publication { id: $id })<-[:PUBLISHED]-(publisher:User)\n" +
            "OPTIONAL MATCH (u:User)-[:LIKES]->(publication)\n" +
            "OPTIONAL MATCH (c:Comment)-[:IS_ATTACHED_TO]->(publication)\n" +
            "RETURN publication, publisher, COUNT(u) as likes, COUNT(c) as comments",
            { id: request.id }
        )
        .then(row => this.toDto(row.records[0] || null))
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());
    }

    private toDto(data: any): PublicationDto {
        if (data.get("publication") === null || data.get("publisher")) {
            throw new NotFoundException("Publication not found.");
        }
        const publication = data.get("publication");
        const publisher = data.get("publisher");
        const likes = data.get("likes").low;
        const comments = data.get("comments").low;

        return {
            id: publication.properties.id,
            content: publication.properties.content,
            postedIn: null,
            createdAt: Neo4jService.parseDate(publication.properties.createdAt),
            comments,
            likes,
            author: {
                id: publisher.properties.id,
                username: publisher.properties.username
            }
        }
    }
}