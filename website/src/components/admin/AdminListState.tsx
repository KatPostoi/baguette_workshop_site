import type { PropsWithChildren, ReactNode } from 'react';
import './AdminLayout.css';

type AdminListStateProps = PropsWithChildren<{
  loading?: boolean;
  error?: ReactNode;
  isEmpty?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
}>;

export const AdminListState = ({
  loading = false,
  error,
  isEmpty = false,
  loadingMessage = 'Загрузка…',
  emptyMessage = 'Нет данных.',
  children,
}: AdminListStateProps) => {
  if (loading) {
    return (
      <div className="admin-list-state" role="status">
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-list-state" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="admin-list-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
