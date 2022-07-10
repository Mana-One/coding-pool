import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Neo4jService } from "../../../../../infrastructure/neo4j/neo4j.service";
import { Usecase } from "../../../../../kernel/usecase";
import { GetPublicationQuery } from "./get-publication.query";
import { PublicationDto } from "./publication.dto";

@Injectable()
export class GetPublicationUsecase implements Usecase<GetPublicationQuery, PublicationDto> {
    constructor(private readonly neo4jService: Neo4jService) {}

    async execute(request: GetPublicationQuery): Promise<PublicationDto> {
        const session = this.neo4jService.startSession();

        const row = await session.run(
            "MATCH (publisher:User)-[:PUBLISHED]->(publication:Publication { id: $id })\n" +

            "CALL {\n" +
            "\tWITH publication\n" +
            "\tOPTIONAL MATCH (l:User)-[:LIKED]->(publication)\n" +
            "\tRETURN COUNT(l) as likes\n" +
            "}\n" +

            "CALL {\n" +
            "\tWITH publication\n" +
            "\tOPTIONAL MATCH (c:Comment)-[:IS_ATTACHED_TO]->(publication)\n" +
            "\tRETURN COUNT(c) as comments\n" +
            "}\n" +

            "CALL {\n" +
            "\tWITH publication\n" +
            "\tRETURN EXISTS((:User {id: $callerId })-[:LIKED]->(publication)) as isLiked\n" +
            "}\n" +

            "RETURN publication, publisher, likes, comments, isLiked",
            { id: request.id, callerId: request.callerId }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());

        return this.toDto(row.records[0] || null);
    }

    private toDto(data: any): PublicationDto {
        if (data.get("publication") === null || data.get("publisher") === null) {
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
            isLiked: data.get("isLiked"),
            author: {
                id: publisher.properties.id,
                username: publisher.properties.username,
                picture: publisher.properties.picture || null
            }
        }
    }
}