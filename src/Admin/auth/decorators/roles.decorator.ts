import { SetMetadata } from "@nestjs/common";

export const ADMINhasRoles = (...ADMINhasRoles: string[]) => SetMetadata('roles', ADMINhasRoles);