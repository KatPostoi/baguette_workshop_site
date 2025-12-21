import classNames from 'classnames';
import type { OrderStatus } from '../../api/types';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Ожидает оплаты',
  PAID: 'Оплачен',
  ASSEMBLY: 'Сборка',
  READY_FOR_PICKUP: 'Готов к выдаче',
  IN_TRANSIT: 'В пути',
  RECEIVED: 'Получен',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  return <span className={classNames('order-status', `order-status_${status.toLowerCase()}`)}>{statusLabels[status]}</span>;
};
