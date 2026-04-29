import classNames from 'classnames';
import { useAuth } from '../../../state/AuthContext';
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
import { AdminEntityDialog } from '../forms/AdminEntityDialog';
import { AdminUserEditForm } from '../forms/AdminUserEditForm';
import {
  type AdminUserGenderFilter,
  formatUserGender,
  formatUserRole,
  formatUserStatus,
} from './adminUserUtils';
import { useAdminUsers } from './useAdminUsers';
import './AdminUsers.css';

type AdminUserManagementTabProps = {
  collectionLabel: string;
  defaultRole: 'ADMIN' | 'CUSTOMER';
  emptyMessage: string;
  entityLabel: string;
};

export const AdminUserManagementTab = ({
  collectionLabel,
  defaultRole,
  emptyMessage,
  entityLabel,
}: AdminUserManagementTabProps) => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const {
    users,
    paginatedUsers,
    filters,
    page,
    loading,
    error,
    dialogMode,
    draft,
    saving,
    setFilters,
    setPage,
    applyFilters,
    resetFilters,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDraft,
    handleSave,
  } = useAdminUsers(defaultRole);

  const isEditingSelf = dialogMode === 'edit' && draft.id === currentUserId;

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
          placeholder="ФИО, Email, телефон"
        />
        <AdminSelect
          label="Пол"
          value={filters.gender}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              gender: event.target.value as AdminUserGenderFilter,
            }))
          }
        >
          <option value="ALL">Любой</option>
          <option value="M">Мужской</option>
          <option value="F">Женский</option>
        </AdminSelect>
        <AdminSelect
          label="Статус"
          value={filters.activity}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              activity: event.target.value as typeof current.activity,
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
            disabled={loading || saving}
          />
        }
        centerContent={
          <AdminPaginationInfo
            total={users.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
          />
        }
        actions={
          <AdminPaginationControls
            total={users.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!users.length}
          loadingMessage={`Загружаем ${collectionLabel.toLowerCase()}…`}
          emptyMessage={emptyMessage}
        >
          <AdminTable
            headers={[
              'ФИО',
              'Email',
              'Телефон',
              'Пол',
              'Роль',
              'Статус',
              'Действия',
            ]}
            className="admin-users-table"
          >
            {paginatedUsers.map((targetUser) => {
              return (
                <div
                  key={targetUser.id}
                  className={classNames('admin-table__row', {
                    'admin-users-table__row_inactive': !targetUser.isActive,
                  })}
                >
                  <div className="admin-users-table__identity">
                    <span className="admin-users-table__name">{targetUser.fullName}</span>
                  </div>
                  <div className="admin-users-table__meta">{targetUser.email}</div>
                  <div>{targetUser.phone ?? '—'}</div>
                  <div>{formatUserGender(targetUser.gender)}</div>
                  <div>
                    <span
                      className={classNames('admin-users-badge', {
                        'admin-users-badge_role-admin': targetUser.role === 'ADMIN',
                        'admin-users-badge_role-customer': targetUser.role === 'CUSTOMER',
                      })}
                    >
                      {formatUserRole(targetUser.role)}
                    </span>
                  </div>
                  <div>
                    <span
                      className={classNames('admin-users-badge', {
                        'admin-users-badge_status-active': targetUser.isActive,
                        'admin-users-badge_status-inactive': !targetUser.isActive,
                      })}
                    >
                      {formatUserStatus(targetUser.isActive)}
                    </span>
                  </div>
                  <AdminRowActions className="admin-table__actions">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(targetUser)}
                      disabled={saving}
                    >
                      Редактировать
                    </Button>
                  </AdminRowActions>
                </div>
              );
            })}
          </AdminTable>
        </AdminListState>
      </AdminListBlock>

      <AdminEntityDialog
        isOpen={dialogMode !== null}
        title={
          dialogMode === 'edit'
            ? `Редактировать ${entityLabel}`
            : `Создать ${entityLabel}`
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        <AdminUserEditForm
          mode={dialogMode === 'edit' ? 'edit' : 'create'}
          draft={draft}
          onChange={updateDraft}
          roleDisabled={isEditingSelf}
          activityDisabled={isEditingSelf}
        />
      </AdminEntityDialog>
    </>
  );
};
