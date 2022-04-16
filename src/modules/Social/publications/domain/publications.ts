import { Repository } from "../../../../kernel/Repository";
import { UID } from "../../../../kernel/UID";
import { Timeline } from "../dtos/timeline";
import { Publication } from "./publication";

export interface Publications extends Repository<UID, Publication> {
    listByUser(userId: UID, limit: number, offset: number)/*: Promise<Timeline>*/;
}