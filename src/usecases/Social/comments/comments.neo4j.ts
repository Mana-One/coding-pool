import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Option } from "fp-ts/lib/Option";
import * as neo4j from "neo4j-driver";
import { Neo4jService } from "../../../infrastructure/neo4j/neo4j.service";
import { UID } from "../../../kernel/UID";
import { Comment } from "./comment.entity";
import { Comments } from "./comments";
import { NotTheOwner } from "./errors";

@Injectable()
export class CommentsNeo4j implements Comments {
    constructor(private readonly neo4jService: Neo4jService) {}

    findById(id: UID): Promise<Option<Comment>> {
        throw new Error("Method not implemented.");
    }

    async removeBy(id: UID, userId: UID): Promise<void> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            const check = await transaction.run(
                "MATCH (u:User)-[co:COMMENTED]->(c:Comment) WHERE u.id = $userId AND c.id = $id RETURN u",
                { id: id.value, userId: userId.value }
            );
            if (check.records.length === 0 || check.records[0] === null) {
                throw new NotTheOwner();
            }

            await transaction.run(
                "MATCH (c:Comment) WHERE c.id = $id " +
                "DETACH DELETE c",
                { id: id.value }
            );

            await transaction.commit();

        } catch(err) {
            await transaction.rollback();
            if (err instanceof HttpException) {
                throw err;
            }
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }

    async save(entity: Comment): Promise<void> {
        const session = this.neo4jService.startSession();
        const transaction = session.beginTransaction();

        try {
            await transaction.run(
                "CREATE (c:Comment { id: $id, content: $content, createdAt: $createdAt })",
                { id: entity.id.value, content: entity.content, createdAt: neo4j.types.DateTime.fromStandardDate(entity.createdAt) }
            );

            await transaction.run(
                "MATCH (u:User), (p:Publication), (c:Comment) WHERE u.id = $userId AND p.id = $publicationId AND c.id = $id " +
                "CREATE (u)-[co:COMMENTED]->(c)-[ia:IS_ATTACHED_TO]->(p)",
                { userId: entity.userId.value, publicationId: entity.publicationId.value, id: entity.id.value }
            );

            await transaction.commit();

        } catch(err) {
            await transaction.rollback();
            throw new InternalServerErrorException(String(err));

        } finally {
            await session.close();
        }
    }
}