import { Inject, Injectable } from "@nestjs/common";
import { PUBLICATIONS } from "../constants";
import { PublicationCreationCommand } from "../dtos/publication-creation.command";
import { Publication } from "../domain/publication";
import { Publications } from "../domain/publications";
import { isLeft } from "fp-ts/lib/Either";
import { GetUserTimelineQuery } from "../dtos/get-user-timeline.query";
import { Timeline } from "../dtos/timeline";
import { UID } from "../../../../kernel/UID";
import { InvalidPublication } from "../domain/errors";

@Injectable()
export class PublicationService {
    constructor(
        @Inject(PUBLICATIONS) 
        private readonly publications: Publications
    ) {}

    async create(command: PublicationCreationCommand): Promise<void> {
        const publication = Publication.create(command);
        if (isLeft(publication)) {
            throw publication.left;
        }
        await this.publications.save(publication.right);
    }
    
    async getUserTimeline(query: GetUserTimelineQuery): Promise<Timeline> {
        const userId = UID.fromString(query.userId, "Invalid user id.");
        if (isLeft(userId)) {
            throw InvalidPublication.fromMessages(userId.left);
        }
        return this.publications.listByUser(userId.right, query.limit, query.offset);
    }
}