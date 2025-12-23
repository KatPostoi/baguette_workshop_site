import { Link } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminShell.css';

type AdminShellProps = PropsWithChildren<{
  title: ReactNode;
  active: 'orders' | 'audit' | 'data';
}>;

export const AdminShell = ({ title, active, children }: AdminShellProps) => (
  <div className="page-container">
    <div className="admin-header">
      <Link to="/" className="admin-back">
        ← На главную
      </Link>
      <h1 className="anonymous-pro-bold admin-header__title">{title}</h1>
    </div>
    <div className="admin-subnav">
      <Link to="/admin/orders" className={active === 'orders' ? 'active' : undefined}>
        Заказы
      </Link>
      <Link to="/admin/audit" className={active === 'audit' ? 'active' : undefined}>
        Аудит
      </Link>
      <Link to="/admin/data" className={active === 'data' ? 'active' : undefined}>
        Данные
      </Link>
    </div>
    {children}
  </div>
);
