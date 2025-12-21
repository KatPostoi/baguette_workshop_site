import { Modal } from '../ui-kit/Modal/Modal';
import { OrderHistory } from './OrderHistory';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../../api/types';
import { Button } from '../ui-kit/Button';

type OrderDetailsModalProps = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel?: (id: string) => Promise<void> | void;
};

const canCancelStatuses: Order['status'][] = ['PENDING', 'PAID', 'ASSEMBLY', 'READY_FOR_PICKUP'];

export const OrderDetailsModal = ({ order, isOpen, onClose, onCancel }: OrderDetailsModalProps) => {
  if (!order) return null;

  const canCancel = onCancel && canCancelStatuses.includes(order.status);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="auth-card">
      <div className="auth-card__header">
        <div>
          <h2 className="auth-card__title">Заказ #{order.id.slice(0, 6)}</h2>
          <p className="auth-card__subtitle">
            Создан: {new Date(order.createdAt).toLocaleString()} · Товаров: {totalItems} · Сумма: {order.total} ₽
          </p>
          <OrderStatusBadge status={order.status} />
          {order.team ? <p className="auth-card__subtitle">Команда: {order.team.name}</p> : null}
        </div>
        <button type="button" className="auth-card__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <div className="auth-card__body order-details">
        <div className="order-details__items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="order-item__title">{item.title}</div>
              <div className="order-item__meta">
                Кол-во: {item.quantity} · Цена: {item.price} ₽
              </div>
            </div>
          ))}
        </div>
        {order.history ? <OrderHistory history={order.history} /> : null}
      </div>

      {canCancel ? (
        <div className="auth-actions">
          <Button type="button" variant="secondary" onClick={() => onCancel?.(order.id)}>
            Отменить заказ
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};
