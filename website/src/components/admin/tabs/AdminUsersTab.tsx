import { AdminUserManagementTab } from '../users/AdminUserManagementTab';

export const AdminUsersTab = () => (
  <AdminUserManagementTab
    title="Пользователи"
    description="Это customer-first проекция общего user-domain. Здесь редактируются покупатели, но фильтр роли остаётся доступным, потому что backend и UI работают поверх одной сущности User."
    defaultRole="CUSTOMER"
    emptyMessage="Нет пользователей по текущему фильтру."
    entityLabel="пользователя"
  />
);
