import { AdminUserManagementTab } from '../users/AdminUserManagementTab';

export const AdminAdminsTab = () => (
  <AdminUserManagementTab
    title="Администраторы"
    description="Это admin-first проекция того же user-domain: отдельного admins-module не появляется, а опасные сценарии закрыты защитой self-deactivate и last-active-admin."
    defaultRole="ADMIN"
    emptyMessage="Нет администраторов по текущему фильтру."
    entityLabel="администратора"
  />
);
