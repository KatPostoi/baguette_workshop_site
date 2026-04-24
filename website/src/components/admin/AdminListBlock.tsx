import type { PropsWithChildren, ReactNode } from 'react';
import { AdminSection } from './AdminSection';
import './AdminLayout.css';

type AdminListBlockProps = PropsWithChildren<{
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export const AdminListBlock = ({
  title,
  description,
  actions,
  className,
  children,
}: AdminListBlockProps) => (
  <AdminSection title={title} actions={actions} className={className}>
    <div className="admin-list-block">
      {description ? <p className="admin-list-block__description">{description}</p> : null}
      <div className="admin-list-block__body">{children}</div>
    </div>
  </AdminSection>
);
