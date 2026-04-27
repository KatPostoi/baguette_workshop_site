import classNames from 'classnames';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminLayout.css';

type AdminFilterPanelProps = PropsWithChildren<{
  actions?: ReactNode;
  className?: string;
  title?: ReactNode;
}>;

export const AdminFilterPanel = ({
  actions,
  className,
  title = 'Фильтр',
  children,
}: AdminFilterPanelProps) => (
  <section className={classNames('admin-filter-panel', className)}>
    <h2 className="admin-filter-panel__title">{title}</h2>
    <div className="admin-filter-panel__grid">{children}</div>
    {actions ? <div className="admin-filter-panel__actions">{actions}</div> : null}
  </section>
);
