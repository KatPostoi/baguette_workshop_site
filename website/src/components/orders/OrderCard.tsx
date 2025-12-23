import classNames from 'classnames';
import type { ReactNode } from 'react';
import './OrderCard.css';

type OrderCardProps = {
  title: ReactNode;
  meta?: ReactNode;
  status?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  leading?: ReactNode;
  className?: string;
};

export const OrderCard = ({
  title,
  meta,
  status,
  body,
  actions,
  leading,
  className,
}: OrderCardProps) => (
  <article className={classNames('order-card', className)}>
    <div className="order-card__header">
      {leading ? <div className="order-card__leading">{leading}</div> : null}
      <div className="order-card__header-content">
        <div className="order-card__title">{title}</div>
        {meta ? <div className="order-card__meta">{meta}</div> : null}
      </div>
      {status ? <div className="order-card__status">{status}</div> : null}
    </div>
    {body ? <div className="order-card__body">{body}</div> : null}
    {actions ? <div className="order-card__actions">{actions}</div> : null}
  </article>
);
