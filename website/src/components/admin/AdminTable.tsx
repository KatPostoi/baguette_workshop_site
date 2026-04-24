import classNames from 'classnames';
import type { PropsWithChildren, ReactNode } from 'react';
import './AdminTable.css';

type AdminTableProps = PropsWithChildren<{
  headers: ReactNode[];
  className?: string;
}>;

export const AdminTable = ({ headers, className, children }: AdminTableProps) => (
  <div className={classNames('admin-table', className)}>
    <div className="admin-table__head">
      {headers.map((header, idx) => (
        <div key={idx}>{header}</div>
      ))}
    </div>
    <div className="admin-table__body">{children}</div>
  </div>
);
