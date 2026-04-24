import classNames from 'classnames';
import type { OrderStatus } from '../../api/types';
import { ORDER_STATUS_LABELS } from './orderStatusMeta';
import './OrderStatusBadge.css';

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <span className={classNames('order-status', `order-status_${status.toLowerCase()}`)}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
};
