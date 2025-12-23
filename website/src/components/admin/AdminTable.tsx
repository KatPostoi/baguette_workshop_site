import type { PropsWithChildren, ReactNode } from 'react';
import './AdminTable.css';

type AdminTableProps = PropsWithChildren<{
  headers: ReactNode[];
}>;

export const AdminTable = ({ headers, children }: AdminTableProps) => (
  <div className="admin-table">
    <div className="admin-table__head">
      {headers.map((header, idx) => (
        <div key={idx}>{header}</div>
      ))}
    </div>
    {children}
  </div>
);
