import { Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { StringUtils } from "../../../kernel/StringUtils";
import { UID } from "../../../kernel/UID";
import { PUBLICATIONS } from "./constants";
import { PublicationCreationCommand } from "./dtos/publication-creation.command";
import { InvalidPublication } from "./errors";
import { Publication } from "./publication.entity";
import { Publications } from "./publications";

@Injectable()
export class PublicationService {
    constructor(
        @Inject(PUBLICATIONS) 
        private readonly publications: Publications
    ) {}

    async create(command: PublicationCreationCommand): Promise<void> {
        const result = pipe(
            sequenceS(cumulativeValidation)({
                content: StringUtils.minLength(1, "Empty publication.")(command.content),
                postedBy: UID.fromString(command.postedBy, "Invalid user id."),
                postedIn: E.of(O.none),
                createdAt: E.of(new Date())
            }),
            E.map(props => Publication.create(props))
        );
        if (E.isLeft(result)) {
            throw InvalidPublication.fromMessages(result.left);
        }
        await this.publications.save(result.right);
    }
}