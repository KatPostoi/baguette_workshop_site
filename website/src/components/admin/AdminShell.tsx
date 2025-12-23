import { Link } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminShell.css';

type AdminShellProps = PropsWithChildren<{
  title: ReactNode;
  active: 'orders' | 'audit' | 'data';
}>;

export const AdminShell = ({ title, active, children }: AdminShellProps) => (
  <div className="page-container">
    <h1 className="anonymous-pro-bold">{title}</h1>
    <div className="admin-subnav">
      <Link to="/admin/orders" className={active === 'orders' ? 'active' : undefined}>
        Заказы
      </Link>
      <Link to="/admin/audit" className={active === 'audit' ? 'active' : undefined}>
        Аудит
      </Link>
      <Link to="/admin/data" className={active === 'data' ? 'active' : undefined}>
        Каталог
      </Link>
    </div>
    {children}
  </div>
);
