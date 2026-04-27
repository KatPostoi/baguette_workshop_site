import { Link } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import './AdminShell.css';

type AdminShellProps = PropsWithChildren<{
  active: 'orders' | 'data';
}>;

export const AdminShell = ({ active, children }: AdminShellProps) => (
  <div className="page-container">
    <div className="admin-header">
      <Link to="/" className="admin-back">
        ← На главную
      </Link>
    </div>
    <div className="admin-subnav">
      <Link to="/admin/orders" className={active === 'orders' ? 'active' : undefined}>
        Заказы
      </Link>
      <Link to="/admin/data" className={active === 'data' ? 'active' : undefined}>
        Данные
      </Link>
    </div>
    {children}
  </div>
);
