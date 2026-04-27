import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminCreateTeam,
  adminDeleteTeam,
  adminListTeams,
  adminUpdateTeam,
} from '../../../api/teams';
import type { Team } from '../../../api/types';
import { useToast } from '../../../state/ToastContext';
import {
  DEFAULT_ADMIN_PAGE_SIZE,
  getAdminErrorMessage,
} from '../adminCrudUtils';
import type { AdminTeamDraft } from '../forms/AdminTeamEditForm';
import {
  buildAdminTeamQuery,
  createAdminTeamFilters,
  createEmptyAdminTeamDraft,
  mapTeamToDraft,
  type AdminTeamFilterState,
  validateAdminTeamDraft,
} from './adminTeamUtils';

type TeamDialogMode = 'create' | 'edit' | null;

export const useAdminTeams = () => {
  const { addToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState<AdminTeamFilterState>(
    createAdminTeamFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<AdminTeamFilterState>(
    createAdminTeamFilters,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<TeamDialogMode>(null);
  const [draft, setDraft] = useState<AdminTeamDraft>(createEmptyAdminTeamDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTeams = useCallback(
    async (nextFilters: AdminTeamFilterState = appliedFilters) => {
      setLoading(true);
      setError(null);

      try {
        setTeams(await adminListTeams(buildAdminTeamQuery(nextFilters)));
      } catch (loadError) {
        console.error(loadError);
        setError(
          getAdminErrorMessage(loadError, 'Не удалось загрузить рабочие группы.'),
        );
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters],
  );

  useEffect(() => {
    void loadTeams(appliedFilters);
  }, [appliedFilters, loadTeams]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(teams.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, teams.length]);

  const paginatedTeams = useMemo(
    () =>
      teams.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [page, teams],
  );

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const resetFilters = () => {
    const nextFilters = createAdminTeamFilters();
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const openCreateDialog = () => {
    setDraft(createEmptyAdminTeamDraft());
    setDialogMode('create');
  };

  const openEditDialog = (team: Team) => {
    setDraft(mapTeamToDraft(team));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogMode(null);
    setDraft(createEmptyAdminTeamDraft());
  };

  const updateDraft = <TKey extends keyof AdminTeamDraft>(
    key: TKey,
    value: AdminTeamDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    const validationError = validateAdminTeamDraft(draft);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'edit' && draft.id) {
        await adminUpdateTeam(draft.id, {
          name: draft.name.trim(),
          active: draft.active,
        });
      } else {
        await adminCreateTeam({ name: draft.name.trim() });
      }

      setDialogMode(null);
      setDraft(createEmptyAdminTeamDraft());
      addToast({
        type: 'success',
        message:
          dialogMode === 'edit'
            ? 'Рабочая группа обновлена.'
            : 'Рабочая группа создана.',
      });
      await loadTeams(appliedFilters);
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          saveError,
          'Не удалось сохранить рабочую группу.',
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
      await adminDeleteTeam(deleteCandidate.id);
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Рабочая группа удалена.' });
      await loadTeams(appliedFilters);
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          deleteError,
          'Не удалось удалить рабочую группу.',
        ),
      });
    } finally {
      setDeleting(false);
    }
  };

  return {
    teams,
    paginatedTeams,
    filters,
    page,
    loading,
    error,
    dialogMode,
    draft,
    saving,
    deleteCandidate,
    deleting,
    setFilters,
    setPage,
    applyFilters,
    resetFilters,
    reloadTeams: () => loadTeams(appliedFilters),
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDraft,
    handleSave,
    setDeleteCandidate,
    handleDelete,
  };
};
