import { AdminUserManagementTab } from '../users/AdminUserManagementTab';

export const AdminUsersTab = () => (
  <AdminUserManagementTab
    collectionLabel="Пользователи"
    defaultRole="CUSTOMER"
    emptyMessage="Нет пользователей по текущему фильтру."
    entityLabel="пользователя"
  />
);
