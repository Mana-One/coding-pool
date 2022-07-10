import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UID } from "../../../../kernel/UID";

export class InvalidPublication extends BadRequestException {
    static fromMessages(messages: string[]): InvalidPublication {
        return new InvalidPublication(messages.join("\n"));
    }
}

export class PublicationNotFound extends NotFoundException {
    static withId(id: UID): PublicationNotFound {
        return new PublicationNotFound(`Publication with id '${id.value}' nout found.`);
    }
}

export class UserPublisherNotFound extends NotFoundException {
    static withId(id: UID): UserPublisherNotFound {
        return new UserPublisherNotFound(`User publisher with id '${id.value}' not found.`);
    }
}