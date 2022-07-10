import { Option } from "fp-ts/lib/Option";
import { Repository } from "../../../kernel/Repository";
import { UID } from "../../../kernel/uid";
import { Program } from "./program";

export interface Programs extends Repository<UID, Program> {
    findByIdAndAuthor(id: UID, authorId: UID): Promise<Option<Program>>;
}