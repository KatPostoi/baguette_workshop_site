import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminDeactivateUser,
  adminListUsers,
  adminUpdateUser,
} from '../../../api/users';
import type { UserProfile } from '../../../api/types';
import { useToast } from '../../../state/ToastContext';
import {
  DEFAULT_ADMIN_PAGE_SIZE,
  getAdminErrorMessage,
} from '../adminCrudUtils';
import type { AdminUserDraft } from '../forms/AdminUserEditForm';
import {
  buildAdminUserQuery,
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
  const [draft, setDraft] = useState<AdminUserDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const openEditDialog = (user: UserProfile) => {
    setDraft(mapUserToDraft(user));
  };

  const closeEditDialog = () => {
    if (!saving) {
      setDraft(null);
    }
  };

  const updateDraft = <TKey extends keyof AdminUserDraft>(
    key: TKey,
    value: AdminUserDraft[TKey],
  ) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSave = async () => {
    if (!draft) {
      return;
    }

    const validationError = validateAdminUserDraft(draft);
    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      await adminUpdateUser(draft.id, {
        fullName: draft.fullName.trim(),
        phone: draft.phone.trim() || null,
        gender: draft.gender.trim() || null,
        role: draft.role,
        isActive: draft.isActive,
      });
      setDraft(null);
      addToast({ type: 'success', message: 'Профиль пользователя обновлён.' });
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

  const handleDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    setDeleting(true);

    try {
      await adminDeactivateUser(deleteCandidate.id);
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Пользователь деактивирован.' });
      await loadUsers(appliedFilters);
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          deleteError,
          'Не удалось деактивировать пользователя.',
        ),
      });
    } finally {
      setDeleting(false);
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
    deleteCandidate,
    deleting,
    setFilters,
    setPage,
    applyFilters,
    resetFilters,
    reloadUsers: () => loadUsers(appliedFilters),
    openEditDialog,
    closeEditDialog,
    updateDraft,
    handleSave,
    setDeleteCandidate,
    handleDelete,
  };
};
