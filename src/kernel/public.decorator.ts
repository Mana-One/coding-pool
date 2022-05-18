import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC = Symbol.for("isPublic");
export const Public = () => SetMetadata(IS_PUBLIC, true);