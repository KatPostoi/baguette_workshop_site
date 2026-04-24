import type { AdminUserSearchParams } from '../../../api/users';
import type { UserProfile, UserRole } from '../../../api/types';
import type { AdminUserDraft } from '../forms/AdminUserEditForm';

export type AdminUserActivityFilter = 'active' | 'inactive' | 'all';
export type AdminUserRoleFilter = UserRole | 'ALL';

export type AdminUserFilterState = {
  search: string;
  role: AdminUserRoleFilter;
  activity: AdminUserActivityFilter;
};

export const createAdminUserFilters = (
  role: AdminUserRoleFilter = 'ALL',
): AdminUserFilterState => ({
  search: '',
  role,
  activity: 'active',
});

export const mapUserToDraft = (user: UserProfile): AdminUserDraft => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  phone: user.phone ?? '',
  gender: user.gender ?? '',
  role: user.role,
  isActive: user.isActive,
});

export const buildAdminUserQuery = (
  filters: AdminUserFilterState,
): AdminUserSearchParams => ({
  search: filters.search.trim() || undefined,
  role: filters.role === 'ALL' ? undefined : filters.role,
  isActive:
    filters.activity === 'all'
      ? undefined
      : filters.activity === 'active',
});

export const formatUserRole = (role: UserRole) =>
  role === 'ADMIN' ? 'Администратор' : 'Покупатель';

export const formatUserGender = (gender?: string | null) => {
  if (!gender) {
    return '—';
  }

  if (gender === 'M') {
    return 'Мужской';
  }

  if (gender === 'F') {
    return 'Женский';
  }

  return gender;
};

export const formatUserStatus = (isActive: boolean) =>
  isActive ? 'Активен' : 'Неактивен';

export const validateAdminUserDraft = (draft: AdminUserDraft) => {
  if (draft.fullName.trim().length < 2) {
    return 'ФИО должно содержать минимум 2 символа.';
  }

  if (draft.phone.trim() && !/^[+\d\s()-]{7,}$/.test(draft.phone.trim())) {
    return 'Телефон должен быть в корректном формате.';
  }

  return null;
};
