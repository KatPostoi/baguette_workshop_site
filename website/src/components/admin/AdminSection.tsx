import classNames from 'classnames';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminSection.css';

type AdminSectionProps = PropsWithChildren<{
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export const AdminSection = ({ title, actions, className, children }: AdminSectionProps) => (
  <section className={classNames('admin-section', className)}>
    <header className="admin-section__header">
      <h2>{title}</h2>
      {actions ? <div className="admin-section__actions">{actions}</div> : null}
    </header>
    {children}
  </section>
);
