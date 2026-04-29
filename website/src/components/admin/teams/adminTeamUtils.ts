import type { Team } from '../../../api/types';
import type { AdminTeamSearchParams } from '../../../api/teams';
import type { AdminTeamDraft } from '../forms/AdminTeamEditForm';

export type AdminTeamActivityFilter = 'active' | 'inactive' | 'all';

export type AdminTeamFilterState = {
  search: string;
  activity: AdminTeamActivityFilter;
};

export const createAdminTeamFilters = (): AdminTeamFilterState => ({
  search: '',
  activity: 'all',
});

export const buildAdminTeamQuery = (
  filters: AdminTeamFilterState,
): AdminTeamSearchParams => {
  const search = filters.search.trim();

  return {
    ...(search ? { search } : {}),
    ...(filters.activity === 'all'
      ? { includeInactive: true }
      : { active: filters.activity === 'active' }),
  };
};

export const createEmptyAdminTeamDraft = (): AdminTeamDraft => ({
  id: null,
  name: '',
  active: true,
});

export const mapTeamToDraft = (team: Team): AdminTeamDraft => ({
  id: team.id,
  name: team.name,
  active: team.active,
});

export const validateAdminTeamDraft = (draft: AdminTeamDraft) => {
  if (!draft.name.trim()) {
    return 'Укажите название рабочей группы.';
  }

  return null;
};

export const formatTeamStatus = (active: boolean) =>
  active ? 'Активна' : 'Неактивна';
