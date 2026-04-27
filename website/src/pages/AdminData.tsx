import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { AdminPageLayout } from '../components/admin/AdminPageLayout';
import { AdminShell } from '../components/admin/AdminShell';
import {
  AdminTabBar,
  type AdminTabOption,
} from '../components/admin/AdminTabBar';
import { AdminCatalogTab } from '../components/admin/tabs/AdminCatalogTab';
import { AdminMaterialsTab } from '../components/admin/tabs/AdminMaterialsTab';
import { AdminStylesTab } from '../components/admin/tabs/AdminStylesTab';
import { AdminServicesTab } from '../components/admin/tabs/AdminServicesTab';
import { AdminUsersTab } from '../components/admin/tabs/AdminUsersTab';
import { AdminAdminsTab } from '../components/admin/tabs/AdminAdminsTab';
import { AdminTeamsTab } from '../components/admin/tabs/AdminTeamsTab';
import './AdminData.css';

type AdminDataTabId =
  | 'catalog'
  | 'materials'
  | 'styles'
  | 'services'
  | 'users'
  | 'admins'
  | 'teams';

const ADMIN_DATA_TABS: AdminTabOption<AdminDataTabId>[] = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'materials', label: 'Материалы' },
  { id: 'styles', label: 'Стили' },
  { id: 'services', label: 'Услуги' },
  { id: 'users', label: 'Пользователи' },
  { id: 'admins', label: 'Администраторы' },
  { id: 'teams', label: 'Рабочие группы' },
];

const TAB_COMPONENTS: Record<AdminDataTabId, ComponentType> = {
  catalog: AdminCatalogTab,
  materials: AdminMaterialsTab,
  styles: AdminStylesTab,
  services: AdminServicesTab,
  users: AdminUsersTab,
  admins: AdminAdminsTab,
  teams: AdminTeamsTab,
};

export const AdminDataPage = () => {
  const { user } = useAuth();
  const role = user?.role ?? null;
  const canAccessAdminData = useMemo(() => can(role, 'catalog:manage'), [role]);
  const [activeTab, setActiveTab] = useState<AdminDataTabId>('catalog');
  const ActiveTab = TAB_COMPONENTS[activeTab];

  if (!canAccessAdminData) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-card__title">Нет прав для работы с административными данными</h2>
          <p className="auth-card__subtitle">Обратитесь к администратору.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell active="data">
      <AdminPageLayout className="admin-data__page">
        <AdminTabBar
          tabs={ADMIN_DATA_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="admin-data__tab-bar"
        />
        <ActiveTab />
      </AdminPageLayout>
    </AdminShell>
  );
};
