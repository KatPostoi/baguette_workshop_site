import { AdminUserManagementTab } from '../users/AdminUserManagementTab';

export const AdminAdminsTab = () => (
  <AdminUserManagementTab
    collectionLabel="Администраторы"
    defaultRole="ADMIN"
    emptyMessage="Нет администраторов по текущему фильтру."
    entityLabel="администратора"
  />
);
