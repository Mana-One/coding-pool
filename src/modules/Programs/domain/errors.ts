import { BadRequestException } from "@nestjs/common";

export class InvalidProgram extends BadRequestException {
    static fromMessages(messages: string[]): InvalidProgram {
        return new InvalidProgram(messages.join("\n"));
    }
}