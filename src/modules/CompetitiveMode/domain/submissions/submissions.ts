import { Option } from "fp-ts/lib/Option";
import { UID } from "../../../../kernel/uid";
import { Submission } from "./submission";

export interface Submissions {
    findWinnerInCompetition(competitionId: UID): Promise<Option<Submission>>;
    // return true if created, false if udpated
    save(submission: Submission): Promise<boolean>;
}