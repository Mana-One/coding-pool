import { Repository } from "../../../../kernel/Repository";
import { UID } from "../../../../kernel/uid";
import { Competition } from "./competition";

export interface Competitions extends Repository<UID, Competition> {}