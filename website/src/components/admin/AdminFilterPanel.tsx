import classNames from 'classnames';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminLayout.css';

type AdminFilterPanelProps = PropsWithChildren<{
  actions?: ReactNode;
  className?: string;
}>;

export const AdminFilterPanel = ({ actions, className, children }: AdminFilterPanelProps) => (
  <section className={classNames('admin-filter-panel', className)}>
    <div className="admin-filter-panel__grid">{children}</div>
    {actions ? <div className="admin-filter-panel__actions">{actions}</div> : null}
  </section>
);
