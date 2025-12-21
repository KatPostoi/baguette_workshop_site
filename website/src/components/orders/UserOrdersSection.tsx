import { useEffect, useState } from 'react';
import { fetchMyOrders, cancelOrder } from '../../api/orders';
import type { Order } from '../../api/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Button } from '../ui-kit/Button';

export const UserOrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      console.error(err);
      setError('Не удалось отменить заказ');
    }
  };

  return (
    <section className="orders-section">
      <h3 className="anonymous-pro-bold">Мои заказы</h3>
      {loading ? <p>Загрузка…</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {!loading && !orders.length ? <p>Заказов пока нет.</p> : null}
      <div className="orders-grid">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__header">
              <div>
                <div className="order-card__title">Заказ #{order.id.slice(0, 6)}</div>
                <div className="order-card__meta">
                  от {new Date(order.createdAt).toLocaleDateString()} · {order.total} ₽
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="order-card__body">
              <div>Товаров: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
              {order.team ? <div>Команда: {order.team.name}</div> : null}
            </div>
            <div className="order-card__actions">
              <Button variant="secondary" onClick={() => setSelected(order)}>
                Подробнее
              </Button>
            </div>
          </article>
        ))}
      </div>
      <OrderDetailsModal
        order={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </section>
  );
};
