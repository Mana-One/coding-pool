import { SetMetadata } from "@nestjs/common";

export const ROLES = Symbol.for("roles");
export const Roles = (...roles: string[]) => SetMetadata(ROLES, roles);