import type { PropsWithChildren, ReactNode } from 'react';
import { AdminSection } from './AdminSection';
import './AdminLayout.css';

type AdminListBlockProps = PropsWithChildren<{
  primaryAction?: ReactNode;
  centerContent?: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export const AdminListBlock = ({
  primaryAction,
  centerContent,
  actions,
  className,
  children,
}: AdminListBlockProps) => (
  <AdminSection className={className}>
    <div className="admin-list-block">
      {primaryAction || centerContent || actions ? (
        <div className="admin-list-block__toolbar">
          <div className="admin-list-block__primary-action">{primaryAction}</div>
          <div className="admin-list-block__toolbar-center">{centerContent}</div>
          <div className="admin-list-block__toolbar-actions">{actions}</div>
        </div>
      ) : null}
      <div className="admin-list-block__body">{children}</div>
    </div>
  </AdminSection>
);
