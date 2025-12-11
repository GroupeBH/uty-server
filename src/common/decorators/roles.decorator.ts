import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type Role = 'buyer' | 'seller' | 'courier' | 'admin';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

