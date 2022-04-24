import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UID } from "../../../kernel/UID";

export class InvalidProgram extends BadRequestException {
    static fromMessages(messages: string[]): InvalidProgram {
        return new InvalidProgram(messages.join("\n"));
    }
}

export class ProgramNotFound extends NotFoundException {
    static withIdAndAuthor(id: UID, authorId: UID): ProgramNotFound {
        return new ProgramNotFound(`Program with id '${id.value}' and authoir id '${authorId.value}' not found.`);
    }
}