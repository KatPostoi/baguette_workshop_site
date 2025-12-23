import { Modal } from '../ui-kit/Modal/Modal';
import { OrderHistory } from './OrderHistory';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order, OrderTimeline } from '../../api/types';
import { Button } from '../ui-kit/Button';
import './OrderDetailsModal.css';

type OrderDetailsModalProps = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel?: (id: string) => Promise<void> | void;
  onPay?: (id: string) => Promise<void> | void;
  payLoadingId?: string | null;
  timeline?: OrderTimeline | null;
};

const canCancelStatuses: Order['status'][] = ['PENDING', 'PAID', 'ASSEMBLY', 'READY_FOR_PICKUP'];
const canPayStatuses: Order['status'][] = ['PENDING'];

export const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  onCancel,
  onPay,
  payLoadingId,
  timeline,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  const canCancel = onCancel && canCancelStatuses.includes(order.status);
  const canPay = onPay && canPayStatuses.includes(order.status);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="order-modal">
      <div className="order-modal__header">
        <div>
          <h2 className="order-modal__title">Заказ #{order.id.slice(0, 6)}</h2>
          <p className="order-modal__subtitle">
            Создан: {new Date(order.createdAt).toLocaleString()} · Товаров: {totalItems} · Сумма: {order.total} ₽
          </p>
          <OrderStatusBadge status={order.status} />
          {order.team ? <p className="order-modal__subtitle">Команда: {order.team.name}</p> : null}
        </div>
        <button type="button" className="order-modal__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <div className="order-modal__body order-details">
        <div className="order-details__items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="order-item__title">{item.title}</div>
              <div className="order-item__meta">
                Кол-во: {item.quantity} · Цена: {item.price} ₽ · Размер: {item.size.widthCm}×
                {item.size.heightCm} см
              </div>
              {item.color ? <div className="order-item__meta">Цвет: {item.color}</div> : null}
              {item.source === 'custom' ? (
                <div className="order-item__meta">Индивидуальная рама (конструктор)</div>
              ) : null}
            </div>
          ))}
        </div>
        {order.history ? <OrderHistory history={order.history} /> : null}
        {timeline ? <OrderHistory history={timeline.history} /> : null}
      </div>

      {canCancel || canPay ? (
        <div className="order-modal__actions">
          {canPay ? (
            <Button
              type="button"
              onClick={() => onPay?.(order.id)}
              disabled={payLoadingId === order.id}
            >
              Оплатить
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => onCancel?.(order.id)}>
            Отменить заказ
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};
