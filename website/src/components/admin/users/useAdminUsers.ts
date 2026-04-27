import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminCreateUser,
  adminListUsers,
  adminUpdateUser,
} from '../../../api/users';
import type { UserProfile } from '../../../api/types';
import { useToast } from '../../../state/ToastContext';
import {
  DEFAULT_ADMIN_PAGE_SIZE,
  getAdminErrorMessage,
} from '../adminCrudUtils';
import type {
  AdminUserDialogMode,
  AdminUserDraft,
} from '../forms/AdminUserEditForm';
import {
  buildAdminUserQuery,
  createEmptyAdminUserDraft,
  createAdminUserFilters,
  mapUserToDraft,
  type AdminUserFilterState,
  type AdminUserRoleFilter,
  validateAdminUserDraft,
} from './adminUserUtils';

export const useAdminUsers = (initialRole: AdminUserRoleFilter) => {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filters, setFilters] = useState<AdminUserFilterState>(() =>
    createAdminUserFilters(initialRole),
  );
  const [appliedFilters, setAppliedFilters] = useState<AdminUserFilterState>(() =>
    createAdminUserFilters(initialRole),
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<AdminUserDialogMode | null>(null);
  const [draft, setDraft] = useState<AdminUserDraft>(
    createEmptyAdminUserDraft(initialRole === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'),
  );
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(
    async (nextFilters: AdminUserFilterState = appliedFilters) => {
      setLoading(true);
      setError(null);

      try {
        setUsers(await adminListUsers(buildAdminUserQuery(nextFilters)));
      } catch (loadError) {
        console.error(loadError);
        setError(
          getAdminErrorMessage(loadError, 'Не удалось загрузить пользователей.'),
        );
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters],
  );

  useEffect(() => {
    void loadUsers(appliedFilters);
  }, [appliedFilters, loadUsers]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(users.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, users.length]);

  const paginatedUsers = useMemo(
    () =>
      users.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [page, users],
  );

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const resetFilters = () => {
    const nextFilters = createAdminUserFilters(initialRole);
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const resolveCreateRole = () => {
    if (filters.role === 'ADMIN' || filters.role === 'CUSTOMER') {
      return filters.role;
    }

    return initialRole === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
  };

  const openCreateDialog = () => {
    setDraft(createEmptyAdminUserDraft(resolveCreateRole()));
    setDialogMode('create');
  };

  const openEditDialog = (user: UserProfile) => {
    setDraft(mapUserToDraft(user));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogMode(null);
    setDraft(createEmptyAdminUserDraft(resolveCreateRole()));
  };

  const updateDraft = <TKey extends keyof AdminUserDraft>(
    key: TKey,
    value: AdminUserDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!dialogMode) {
      return;
    }

    const validationError = validateAdminUserDraft(draft, dialogMode);
    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'edit' && draft.id) {
        await adminUpdateUser(draft.id, {
          fullName: draft.fullName.trim(),
          phone: draft.phone.trim() || null,
          gender: draft.gender.trim() || null,
          role: draft.role,
          isActive: draft.isActive,
        });
      } else {
        await adminCreateUser({
          email: draft.email.trim(),
          password: draft.password,
          fullName: draft.fullName.trim(),
          phone: draft.phone.trim() || null,
          gender: draft.gender.trim() || null,
          role: draft.role,
          isActive: draft.isActive,
        });
        setPage(1);
      }

      setDialogMode(null);
      setDraft(createEmptyAdminUserDraft(resolveCreateRole()));
      addToast({
        type: 'success',
      message:
          dialogMode === 'edit'
            ? 'Профиль пользователя обновлён.'
            : 'Пользователь создан.',
      });
      await loadUsers(appliedFilters);
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          saveError,
          'Не удалось обновить пользователя.',
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    users,
    paginatedUsers,
    filters,
    page,
    loading,
    error,
    draft,
    saving,
    setFilters,
    setPage,
    applyFilters,
    resetFilters,
    dialogMode,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDraft,
    handleSave,
  };
};
