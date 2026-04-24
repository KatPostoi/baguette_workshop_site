import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import './AdminLayout.css';

type AdminPageLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export const AdminPageLayout = ({ className, children }: AdminPageLayoutProps) => (
  <div className={classNames('admin-page-layout', className)}>{children}</div>
);
