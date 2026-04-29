import classNames from 'classnames';
import { Button } from '../../ui-kit/Button';
import { AdminCreateButton } from '../AdminCreateButton';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';
import {
  AdminPaginationControls,
  AdminPaginationInfo,
} from '../AdminPagination';
import { AdminRowActions } from '../AdminRowActions';
import { AdminTable } from '../AdminTable';
import { DEFAULT_ADMIN_PAGE_SIZE } from '../adminCrudUtils';
import { AdminConfirmDialog } from '../forms/AdminConfirmDialog';
import { AdminEntityDialog } from '../forms/AdminEntityDialog';
import { AdminTeamEditForm } from '../forms/AdminTeamEditForm';
import {
  formatTeamStatus,
  type AdminTeamActivityFilter,
} from './adminTeamUtils';
import { useAdminTeams } from './useAdminTeams';
import './AdminTeams.css';

export const AdminTeamManagementTab = () => {
  const {
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
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDraft,
    handleSave,
    setDeleteCandidate,
    handleDelete,
  } = useAdminTeams();

  return (
    <>
      <AdminFilterPanel
        actions={
          <>
            <Button onClick={applyFilters}>Применить</Button>
            <Button variant="secondary" onClick={resetFilters}>
              Сбросить
            </Button>
          </>
        }
      >
        <AdminInput
          label="Поиск"
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({ ...current, search: event.target.value }))
          }
          placeholder="Название"
        />
        <AdminSelect
          label="Статус"
          value={filters.activity}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              activity: event.target.value as AdminTeamActivityFilter,
            }))
          }
        >
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="all">Все</option>
        </AdminSelect>
      </AdminFilterPanel>

      <AdminListBlock
        primaryAction={
          <AdminCreateButton
            onClick={openCreateDialog}
            disabled={loading || saving || deleting}
          />
        }
        centerContent={
          <AdminPaginationInfo
            total={teams.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
          />
        }
        actions={
          <AdminPaginationControls
            total={teams.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!teams.length}
          loadingMessage="Загружаем рабочие группы…"
          emptyMessage="Нет рабочих групп по текущему фильтру."
        >
          <AdminTable
            headers={['Рабочая группа', 'Статус', 'Действия']}
            className="admin-teams-table"
          >
            {paginatedTeams.map((team) => (
              <div
                key={team.id}
                className={classNames('admin-table__row', {
                  'admin-teams-table__row_inactive': !team.active,
                })}
              >
                <div className="admin-teams-table__identity">
                  <span className="admin-teams-table__name">{team.name}</span>
                </div>
                <div>
                  <span
                    className={classNames('admin-teams-badge', {
                      'admin-teams-badge_status-active': team.active,
                      'admin-teams-badge_status-inactive': !team.active,
                    })}
                  >
                    {formatTeamStatus(team.active)}
                  </span>
                </div>
                <AdminRowActions className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(team)}
                    disabled={saving || deleting}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteCandidate(team)}
                    disabled={deleting || saving}
                  >
                    Удалить
                  </Button>
                </AdminRowActions>
              </div>
            ))}
          </AdminTable>
        </AdminListState>
      </AdminListBlock>

      <AdminEntityDialog
        isOpen={dialogMode !== null}
        title={
          dialogMode === 'edit'
            ? 'Редактировать рабочую группу'
            : 'Новая рабочая группа'
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать группу'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        <AdminTeamEditForm
          draft={draft}
          mode={dialogMode === 'edit' ? 'edit' : 'create'}
          onChange={updateDraft}
        />
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={deleteCandidate !== null}
        title="Удалить рабочую группу?"
        description={
          deleteCandidate
            ? `Рабочая группа «${deleteCandidate.name}» будет удалена из базы данных. В уже существующих заказах привязка к ней будет снята автоматически.`
            : ''
        }
        confirmLabel="Удалить группу"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleting) {
            setDeleteCandidate(null);
          }
        }}
      />
    </>
  );
};
