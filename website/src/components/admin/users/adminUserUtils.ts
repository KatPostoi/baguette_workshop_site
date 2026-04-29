import type { AdminUserSearchParams } from '../../../api/users';
import type { UserProfile, UserRole } from '../../../api/types';
import type { AdminUserDraft } from '../forms/AdminUserEditForm';

export type AdminUserActivityFilter = 'active' | 'inactive' | 'all';
export type AdminUserGenderFilter = 'ALL' | 'M' | 'F';

export type AdminUserFilterState = {
  search: string;
  gender: AdminUserGenderFilter;
  activity: AdminUserActivityFilter;
};

export const createAdminUserFilters = (): AdminUserFilterState => ({
  search: '',
  gender: 'ALL',
  activity: 'active',
});

export const createEmptyAdminUserDraft = (
  role: UserRole = 'CUSTOMER',
): AdminUserDraft => ({
  id: null,
  email: '',
  password: '',
  fullName: '',
  phone: '',
  gender: '',
  role,
  isActive: true,
});

export const mapUserToDraft = (user: UserProfile): AdminUserDraft => ({
  id: user.id,
  email: user.email,
  password: '',
  fullName: user.fullName,
  phone: user.phone ?? '',
  gender: user.gender ?? '',
  role: user.role,
  isActive: user.isActive,
});

export const buildAdminUserQuery = (
  filters: AdminUserFilterState,
  role?: UserRole,
): AdminUserSearchParams => ({
  search: filters.search.trim() || undefined,
  role,
  gender: filters.gender === 'ALL' ? undefined : filters.gender,
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

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validateAdminUserDraft = (
  draft: AdminUserDraft,
  mode: 'create' | 'edit',
) => {
  if (mode === 'create' && !isValidEmail(draft.email.trim())) {
    return 'Укажите корректный email.';
  }

  if (mode === 'create' && draft.password.trim().length < 6) {
    return 'Пароль должен содержать минимум 6 символов.';
  }

  if (draft.fullName.trim().length < 2) {
    return 'ФИО должно содержать минимум 2 символа.';
  }

  if (draft.phone.trim() && !/^[+\d\s()-]{7,}$/.test(draft.phone.trim())) {
    return 'Телефон должен быть в корректном формате.';
  }

  return null;
};
