import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import './AdminSection.css';

type AdminSectionProps = PropsWithChildren<{
  className?: string;
}>;

export const AdminSection = ({ className, children }: AdminSectionProps) => (
  <section className={classNames('admin-section', className)}>
    {children}
  </section>
);
