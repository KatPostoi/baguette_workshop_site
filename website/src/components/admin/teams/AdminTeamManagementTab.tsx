import classNames from 'classnames';
import { Button } from '../../ui-kit/Button';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';
import { AdminPagination } from '../AdminPagination';
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
    reloadTeams,
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
            <Button variant="secondary" onClick={() => void reloadTeams()} disabled={loading}>
              Обновить
            </Button>
            <Button onClick={openCreateDialog}>Новая группа</Button>
          </>
        }
      >
        <AdminInput
          label="Поиск"
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({ ...current, search: event.target.value }))
          }
          placeholder="UUID или название"
          helper="Working Groups остаются проекцией существующей сущности Team без нового domain-layer."
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
        title="Рабочие группы"
        description="Команды управляются через существующую сущность Team: удаление выполняется как deactivate, активные группы доступны для новых назначений в Заказах, а уже назначенные inactive-группы остаются видимыми в карточках и истории."
        actions={
          <AdminPagination
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
                  <span className="admin-teams-table__meta">{team.id}</span>
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
                    disabled={deleting || !team.active}
                    title={
                      team.active
                        ? undefined
                        : 'Рабочая группа уже деактивирована.'
                    }
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
        description={
          dialogMode === 'edit'
            ? 'Меняется только существующая Team-сущность: имя и статус активности.'
            : 'Новая группа сразу создаётся активной и становится доступной для назначения заказов.'
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
        title="Деактивировать рабочую группу?"
        description={
          deleteCandidate
            ? `Группа «${deleteCandidate.name}» станет неактивной и исчезнет из новых назначений в разделе «Заказы». Уже назначенные заказы сохранят ссылку на эту группу.`
            : ''
        }
        confirmLabel="Деактивировать"
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
