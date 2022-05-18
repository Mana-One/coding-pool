import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC } from "../modules/UserAccess/auth.constants";

export const Public = () => SetMetadata(IS_PUBLIC, true);