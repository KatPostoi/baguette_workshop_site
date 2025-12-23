import { useEffect, useState } from 'react';
import { fetchMyOrders, cancelOrder, payOrder } from '../../api/orders';
import type { Order } from '../../api/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Button } from '../ui-kit/Button';
import { OrderCard } from './OrderCard';
import './UserOrdersSection.css';
import { useToast } from '../../state/ToastContext';

export const UserOrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить заказы');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleCancel = async (orderId: string) => {
    try {
      const updated = await cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected(updated);
      addToast({ type: 'info', message: 'Заказ отменён' });
    } catch (err) {
      console.error(err);
      setError('Не удалось отменить заказ');
      addToast({ type: 'error', message: 'Не удалось отменить заказ' });
    }
  };

  const handlePay = async (orderId: string) => {
    setPayLoadingId(orderId);
    try {
      const updated = await payOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected(updated);
      addToast({ type: 'success', message: 'Оплата прошла успешно' });
    } catch (err) {
      console.error(err);
      setError('Не удалось оплатить заказ');
      addToast({ type: 'error', message: 'Не удалось оплатить заказ' });
    } finally {
      setPayLoadingId(null);
    }
  };

  return (
    <section className="orders-section">
      <h3 className="anonymous-pro-bold">Мои заказы</h3>
      {loading ? <p>Загрузка…</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {!loading && !orders.length ? <p>Заказов пока нет.</p> : null}
      <div className="user-orders__list">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            title={`Заказ #${order.id.slice(0, 6)}`}
            meta={
              <>
                <span>от {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>{order.total} ₽</span>
              </>
            }
            status={<OrderStatusBadge status={order.status} />}
            body={
              <>
                <div>Товаров: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                {order.team ? <div>Команда: {order.team.name}</div> : null}
              </>
            }
            actions={
              <>
                {order.status === 'PENDING' ? (
                  <Button
                    onClick={() => void handlePay(order.id)}
                    disabled={payLoadingId === order.id}
                  >
                    {payLoadingId === order.id ? 'Оплата…' : 'Оплатить'}
                  </Button>
                ) : null}
                <Button variant="secondary" onClick={() => setSelected(order)}>
                  Подробнее
                </Button>
              </>
            }
          />
        ))}
      </div>
      <OrderDetailsModal
        order={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
        onPay={handlePay}
        payLoadingId={payLoadingId}
      />
    </section>
  );
};
