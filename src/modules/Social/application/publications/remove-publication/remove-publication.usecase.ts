import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { UID } from "../../../../../kernel/UID";
import { Usecase } from "../../../../../kernel/Usecase";
import { PUBLICATIONS } from "../../../constants";
import { InvalidPublication, PublicationNotFound } from "../../../domain/publications/errors";
import { Publication } from "../../../domain/publications/publication";
import { Publications } from "../../../domain/publications/publications";
import { RemovePublicationCommand } from "./remove-publication.command";

@Injectable()
export class RemovePublicationUsecase implements Usecase<RemovePublicationCommand, void> {
    constructor(@Inject(PUBLICATIONS) private readonly publications: Publications) {}

    async execute(request: RemovePublicationCommand): Promise<void> {
        const publication = await this.fetchPublication(request.publicationId);
        if (publication.postedBy.value !== request.callerId) {
            throw new ForbiddenException("A publication can only be removed by its publisher.");
        }

        await this.publications.remove(publication);
    }

    private async fetchPublication(id: string): Promise<Publication> {
        const publicationId = UID.fromString(id, "Invalid publication id.");
        if (E.isLeft(publicationId)) {
            throw InvalidPublication.fromMessages(publicationId.left);
        }

        const publication = await this.publications.findById(publicationId.right);
        if (O.isNone(publication)) {
            throw PublicationNotFound.withId(publicationId.right);
        }
        return publication.value;
    }
}