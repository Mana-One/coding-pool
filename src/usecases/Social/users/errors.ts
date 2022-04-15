import { BadRequestException } from "@nestjs/common";

export class InvalidUser extends BadRequestException {
    static fromMessages(messages: string[]): InvalidUser {
        return new InvalidUser(messages.join("\n"));
    }
}