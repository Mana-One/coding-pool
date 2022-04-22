import { Inject, Injectable } from "@nestjs/common";
import { isLeft } from "fp-ts/lib/Either";
import { PUBLICATIONS } from "../../../constants";
import { Publication } from "../../../domain/publications/publication";
import { Publications } from "../../../domain/publications/publications";
import { CreatePublicationCommand } from "./create-publication.command";

@Injectable()
export class CreatePublicationUsecase {
    constructor(@Inject(PUBLICATIONS) private readonly publications: Publications) {}
    
    async execute(request: CreatePublicationCommand): Promise<void> {
        const publication = Publication.create(request);
        if (isLeft(publication)) {
            throw publication.left;
        }
        await this.publications.save(publication.right);
    }
}