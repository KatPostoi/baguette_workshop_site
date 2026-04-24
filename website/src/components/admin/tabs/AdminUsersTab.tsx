import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminSearchUsers } from '../../../api/users';
import type { UserProfile } from '../../../api/types';
import { useToast } from '../../../state/ToastContext';
import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminInput } from '../AdminField';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';
import { AdminPagination } from '../AdminPagination';
import { AdminTable } from '../AdminTable';
import { Button } from '../../ui-kit/Button';

const PAGE_SIZE = 10;

const formatRole = (value: string) => (value === 'ADMIN' ? 'Администратор' : 'Покупатель');

export const AdminUsersTab = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setUsers(
        await adminSearchUsers({
          search: appliedSearch || undefined,
          role: 'CUSTOMER',
        }),
      );
    } catch (loadError) {
      console.error(loadError);
      setError('Не удалось загрузить пользователей.');
      addToast({ type: 'error', message: 'Не удалось загрузить пользователей.' });
    } finally {
      setLoading(false);
    }
  }, [addToast, appliedSearch]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const paginatedUsers = useMemo(
    () => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, users],
  );

  return (
    <>
      <AdminFilterPanel
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setAppliedSearch(search);
              setPage(1);
            }}
          >
            Найти
          </Button>
        }
      >
        <AdminInput
          label="Поиск"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Email, ФИО, телефон"
        />
      </AdminFilterPanel>

      <AdminListBlock
        title="Пользователи"
        description="Это customer-only проекция. Так лучше, чем смешивать покупателей и администраторов в одном списке, потому что отдельная вкладка Admins уже зарезервирована под role=ADMIN."
        actions={<AdminPagination total={users.length} page={page} pageSize={PAGE_SIZE} onChange={setPage} />}
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!users.length}
          loadingMessage="Загружаем пользователей…"
          emptyMessage="Нет пользователей по текущему фильтру."
        >
          <AdminTable headers={['ID', 'Email', 'Имя', 'Телефон', 'Роль']}>
            {paginatedUsers.map((user) => (
              <div key={user.id} className="admin-table__row">
                <div>{user.id}</div>
                <div>{user.email}</div>
                <div>{user.fullName}</div>
                <div>{user.phone ?? '—'}</div>
                <div>{formatRole(user.role)}</div>
              </div>
            ))}
          </AdminTable>
        </AdminListState>
      </AdminListBlock>
    </>
  );
};
