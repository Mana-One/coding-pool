import { Submission } from "./submission";

export interface Submissions {
    // return true if created, false if udpated
    save(submission: Submission): Promise<boolean>;
}