import classNames from 'classnames';
import { useAuth } from '../../../state/AuthContext';
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
import { AdminUserEditForm } from '../forms/AdminUserEditForm';
import {
  formatUserGender,
  formatUserRole,
  formatUserStatus,
  type AdminUserRoleFilter,
} from './adminUserUtils';
import { useAdminUsers } from './useAdminUsers';
import './AdminUsers.css';

type AdminUserManagementTabProps = {
  title: string;
  description: string;
  defaultRole: AdminUserRoleFilter;
  emptyMessage: string;
  entityLabel: string;
};

export const AdminUserManagementTab = ({
  title,
  description,
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
    draft,
    saving,
    deleteCandidate,
    deleting,
    setFilters,
    setPage,
    applyFilters,
    resetFilters,
    reloadUsers,
    openEditDialog,
    closeEditDialog,
    updateDraft,
    handleSave,
    setDeleteCandidate,
    handleDelete,
  } = useAdminUsers(defaultRole);

  const isEditingSelf = draft?.id === currentUserId;

  return (
    <>
      <AdminFilterPanel
        actions={
          <>
            <Button onClick={applyFilters}>Применить</Button>
            <Button variant="secondary" onClick={resetFilters}>
              Сбросить
            </Button>
            <Button variant="secondary" onClick={() => void reloadUsers()} disabled={loading}>
              Обновить
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
          placeholder="Email, ФИО, телефон"
          helper="Users и Admins работают поверх одной сущности User; вкладка отличается только стартовым role-filter."
        />
        <AdminSelect
          label="Роль"
          value={filters.role}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              role: event.target.value as AdminUserRoleFilter,
            }))
          }
        >
          <option value="ALL">Все роли</option>
          <option value="CUSTOMER">Покупатели</option>
          <option value="ADMIN">Администраторы</option>
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
        title={title}
        description={description}
        actions={
          <AdminPagination
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
          loadingMessage={`Загружаем ${title.toLowerCase()}…`}
          emptyMessage={emptyMessage}
        >
          <AdminTable
            headers={[
              'Пользователь',
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
              const isSelf = targetUser.id === currentUserId;
              const deleteDisabled = deleting || isSelf || !targetUser.isActive;

              return (
                <div
                  key={targetUser.id}
                  className={classNames('admin-table__row', {
                    'admin-users-table__row_inactive': !targetUser.isActive,
                  })}
                >
                  <div className="admin-users-table__identity">
                    <span className="admin-users-table__name">{targetUser.fullName}</span>
                    <span className="admin-users-table__meta">{targetUser.id}</span>
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
                      disabled={saving || deleting}
                    >
                      Редактировать
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setDeleteCandidate(targetUser)}
                      disabled={deleteDisabled}
                      title={
                        isSelf
                          ? 'Нельзя деактивировать текущего администратора.'
                          : !targetUser.isActive
                            ? 'Пользователь уже деактивирован.'
                            : undefined
                      }
                    >
                      Удалить
                    </Button>
                  </AdminRowActions>
                </div>
              );
            })}
          </AdminTable>
        </AdminListState>
      </AdminListBlock>

      <AdminEntityDialog
        isOpen={Boolean(draft)}
        title={`Редактировать ${entityLabel}`}
        description="Email и passwordHash не редактируются через админку. Здесь доступны только безопасные профильные поля и lifecycle-флаг."
        submitLabel="Сохранить изменения"
        onClose={closeEditDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
        footerStart={
          isEditingSelf ? (
            <span className="admin-users-dialog__note">
              Текущий администратор не может менять свою роль или деактивировать себя.
            </span>
          ) : (
            <span className="admin-users-dialog__note">
              Кнопка «Удалить» выполняет soft deactivate и не удаляет исторические данные.
            </span>
          )
        }
      >
        {draft ? (
          <AdminUserEditForm
            draft={draft}
            onChange={updateDraft}
            roleDisabled={isEditingSelf}
            activityDisabled={isEditingSelf}
          />
        ) : null}
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        title={`Удалить ${entityLabel}?`}
        description={
          deleteCandidate
            ? `${deleteCandidate.fullName} будет деактивирован${deleteCandidate.role === 'ADMIN' ? '. Защита последнего активного администратора сохранена.' : ', а связанные заказы и история останутся целыми.'}`
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
