import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/UID";
import { Publication } from "./publication.entity";

export interface Publications extends Repository<UID, Publication> {}