import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as O from "fp-ts/lib/Option";
import * as neo4j from 'neo4j-driver';
import { Neo4jService } from "../../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../../kernel/UID";
import { Publication } from "../../domain/publications/publication";
import { Publications } from "../../domain/publications/publications";

@Injectable()
export class Neo4jPublications implements Publications {
    constructor(private readonly neo4jService: Neo4jService) {}

    async findById(id: UID): Promise<O.Option<Publication>> {
        const session = this.neo4jService.startSession();
        const row = await session.run(
            "MATCH (publication:Publication {id: $id})<-[:PUBLISHED]-(publisher:User)\n" +
            "RETURN publication, publisher",
            { id: id.value }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());

        if (row.records.length === 0) {
            return O.none;
        }
        return O.some(this.toDomain(row.records[0]));
    }

    async remove(entity: Publication): Promise<void> {
        const session = this.neo4jService.startSession();
        await session.run(
          "MATCH (p:Publication {id: $id})\n" +
          "OPTIONAL MATCH (p)<-[:IS_ATTACHED_TO]-(c:Comment)\n" +
          "DETACH DELETE c, p",
          { id: entity.id.value }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());
    }

    async save(entity: Publication): Promise<void> {
        const session = this.neo4jService.startSession();
        await session.run(
            "MATCH (u:User { id: $userId })\n" +
            "CREATE (u)-[pu:PUBLISHED]->(p:Publication { id: $id, content: $content, createdAt: $createdAt })",
            { userId: entity.postedBy.value, id: entity.id.value, content: entity.content, createdAt: neo4j.types.DateTime.fromStandardDate(entity.createdAt) }
        )
        .catch(err => { throw new InternalServerErrorException(String(err)); })
        .finally(async () => await session.close());
    }

    private toDomain(data: any): Publication {
        const publication = data.get("publication");
        const publisher = data.get("publisher");
        return Publication.of({
            id: UID.of(publication.properties.id),
            content: publication.properties.content,
            postedBy: UID.of(publisher.properties.id),
            postedIn: O.none,
            createdAt: Neo4jService.parseDate(publication.properties.createdAt)
        });
    }
}