import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/UID";
import { Program } from "./program";

export interface Programs extends Repository<UID, Program> {}