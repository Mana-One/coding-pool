import { Repository } from "../../../../kernel/repository";
import { UID } from "../../../../kernel/uid";
import { Publication } from "./publication";

export interface Publications extends Repository<UID, Publication> {}