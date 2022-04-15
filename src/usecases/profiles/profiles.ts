import { Option } from "fp-ts/lib/Option";
import { Profile } from "./profile.dto";

export interface Profiles {
    findById(id: string): Promise<Option<Profile>>;
}