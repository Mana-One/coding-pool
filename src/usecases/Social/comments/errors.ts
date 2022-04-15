import { BadRequestException, ForbiddenException } from "@nestjs/common";

export class InvalidComment extends BadRequestException {
    static fromMessages(messages: string[]): InvalidComment {
        return new InvalidComment(messages.join("\n"));
    }
}

export class NotTheOwner extends ForbiddenException {
    constructor() {
        super("The current user is either non-existent or not the comment owner.");
    }
}