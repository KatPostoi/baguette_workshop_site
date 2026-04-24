import type { UserRole } from '../api/types';

export type Permission =
  | 'orders:read'
  | 'orders:update'
  | 'catalog:manage'
  | 'users:read'
  | 'admin:access';

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    'admin:access',
    'orders:read',
    'orders:update',
    'catalog:manage',
    'users:read',
  ],
  CUSTOMER: ['orders:read'],
};

export const can = (role: UserRole | null | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
};

export const hasAdminAccess = (role: UserRole | null | undefined): boolean => can(role, 'admin:access');
