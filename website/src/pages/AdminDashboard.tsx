import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAdminOrders, fetchTeams, assignTeam, updateOrderStatus } from '../api/orders';
import type { Order, OrderStatus, Team } from '../api/types';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { Button } from '../components/ui-kit/Button';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'PAID',
  'ASSEMBLY',
  'READY_FOR_PICKUP',
  'IN_TRANSIT',
  'RECEIVED',
  'COMPLETED',
  'CANCELLED',
];

export const AdminDashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, teamsData] = await Promise.all([
        fetchAdminOrders({
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(teamFilter ? { teamId: teamFilter } : {}),
        }),
        fetchTeams(),
      ]);
      setOrders(ordersData);
      setTeams(teamsData);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, teamFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAssignTeam = async (orderId: string, teamId: string) => {
    try {
      const updated = await assignTeam(orderId, teamId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
    } catch (err) {
      console.error(err);
      setError('Не удалось назначить команду');
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, { status });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
    } catch (err) {
      console.error(err);
      setError('Не удалось сменить статус');
    }
  };

  const statusSelect = useMemo(
    () => (
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter((e.target.value as OrderStatus) || '')}
        className="auth-input"
      >
        <option value="">Все статусы</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    ),
    [statusFilter],
  );

  return (
    <div className="page-container">
      <h1 className="anonymous-pro-bold">Админка</h1>
      {error ? <p className="auth-error">{error}</p> : null}
      <div className="admin-filters">
        <label>
          Статус: {statusSelect}
        </label>
        <label>
          Команда:{' '}
          <select
            className="auth-input"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="">Все</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" onClick={() => void load()}>
          Обновить
        </Button>
      </div>
      {loading ? <p>Загрузка…</p> : null}
      <div className="orders-grid">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__header">
              <div>
                <div className="order-card__title">Заказ #{order.id.slice(0, 6)}</div>
                <div className="order-card__meta">
                  Клиент: {order.customerEmail} · Сумма: {order.total} ₽
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="order-card__body">
              <div>Команда: {order.team?.name ?? '—'}</div>
              <div>Создан: {new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="order-card__actions">
              <select
                className="auth-input"
                value={order.team?.id ?? ''}
                onChange={(e) => handleAssignTeam(order.id, e.target.value)}
              >
                <option value="">Назначить команду</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select
                className="auth-input"
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
              >
                {STATUS_OPTIONS.map((s: OrderStatus) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={() => setSelected(order)}>
                Детали
              </Button>
            </div>
          </article>
        ))}
      </div>

      <OrderDetailsModal order={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
};
