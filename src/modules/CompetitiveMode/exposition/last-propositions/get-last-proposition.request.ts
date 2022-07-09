import { IsUUID } from "class-validator";

export class GetLastPropositionRequest {
    @IsUUID()
    competitionId: string;

    @IsUUID()
    participantId: string;
}