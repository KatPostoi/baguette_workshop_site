import classNames from 'classnames';
import type { ReactNode } from 'react';
import './AdminLayout.css';

export type AdminTabOption<TTabId extends string> = {
  id: TTabId;
  label: ReactNode;
};

type AdminTabBarProps<TTabId extends string> = {
  tabs: AdminTabOption<TTabId>[];
  activeTab: TTabId;
  onChange: (tabId: TTabId) => void;
  className?: string;
};

export const AdminTabBar = <TTabId extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: AdminTabBarProps<TTabId>) => (
  <div className={classNames('admin-tab-bar', className)} role="tablist" aria-label="Разделы данных">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        className="admin-tab-bar__button"
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
