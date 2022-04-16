import { Inject, Injectable } from "@nestjs/common";
import { PUBLICATIONS } from "../constants";
import { PublicationCreationCommand } from "../dtos/publication-creation.command";
import { Publication } from "../domain/publication";
import { Publications } from "../domain/publications";
import { isLeft } from "fp-ts/lib/Either";

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
}