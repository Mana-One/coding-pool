import { BadRequestException } from "@nestjs/common";

export class InvalidCompetition extends BadRequestException {
    static fromMessages(messages: string[]): InvalidCompetition {
        return new InvalidCompetition(messages.join("\n"));
    }
}