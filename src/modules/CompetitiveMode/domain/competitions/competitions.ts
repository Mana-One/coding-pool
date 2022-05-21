import { Repository } from "../../../../kernel/Repository";
import { UID } from "../../../../kernel/UID";
import { Competition } from "./competition";

export interface Competitions extends Repository<UID, Competition> {}