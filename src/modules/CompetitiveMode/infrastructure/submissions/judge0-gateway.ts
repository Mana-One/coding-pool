import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { AppConfig } from "../../../../config/app.config";
import { Judge0Config } from "../../../../config/judge0.config";
import { CodeJudge } from "../../application/submissions/code-judge";

@Injectable()
export class Judg0Gateway implements CodeJudge {
    constructor(
        private readonly judge0Config: Judge0Config,
        private readonly appConfig: AppConfig
    ) {}

    async send(input: { competitionId: string; participantId: string; participant: string; language_id: number, source_code: string; stdin: string; expectedStdout: string; }): Promise<{ token: string; }> {
        const callbackUrl = new URL("/submissions", this.appConfig.HOST);
        callbackUrl.searchParams.set("competitionId", input.competitionId);
        callbackUrl.searchParams.set("participantId", input.participantId);
        callbackUrl.searchParams.set("participant", input.participant);
        
        const response = await axios({
            method: "post",
            url: this.judge0Config.URL + "submissions",
            data: {
                source_code: input.source_code,
                language_id: input.language_id,
                stdin: input.stdin,
                expectedStdout: input.expectedStdout,
                callback_url: callbackUrl.toString()
            }
        });
        return response.data;
    }
}