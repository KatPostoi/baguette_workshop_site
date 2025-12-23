import type { PropsWithChildren, ReactNode } from 'react';
import './AdminSection.css';

type AdminSectionProps = PropsWithChildren<{
  title: ReactNode;
  actions?: ReactNode;
}>;

export const AdminSection = ({ title, actions, children }: AdminSectionProps) => (
  <section className="admin-section">
    <header className="admin-section__header">
      <h2>{title}</h2>
      {actions ? <div className="admin-section__actions">{actions}</div> : null}
    </header>
    {children}
  </section>
);
