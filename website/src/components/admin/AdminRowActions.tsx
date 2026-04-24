import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import './AdminLayout.css';

type AdminRowActionsProps = PropsWithChildren<{
  className?: string;
}>;

export const AdminRowActions = ({ className, children }: AdminRowActionsProps) => (
  <div className={classNames('admin-row-actions', className)}>{children}</div>
);
