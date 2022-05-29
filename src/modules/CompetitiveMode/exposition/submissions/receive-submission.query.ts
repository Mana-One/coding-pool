import { IsString, IsUUID } from "class-validator"

export class ReceiveSubmissionQuery {
    @IsUUID()
    competitionId: string;

    @IsUUID()
    participantId: string;

    @IsString()
    participant: string;
}