export type CompetitionStatus = 
    | "in-progress" 
    | "published";

export namespace CompetitionStatus {
    export const IN_PROGRESS: CompetitionStatus = "in-progress";
    export const PUBLISHED: CompetitionStatus = "published";
}