import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminOrders,
  fetchTeams,
  assignTeam,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  fetchOrderTimeline,
} from '../api/orders';
import type { Order, OrderStatus, Team, OrderTimeline } from '../api/types';
import { OrderStatusBadge } from '../components/orders/OrderStatusBadge';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { OrderCard } from '../components/orders/OrderCard';
import { Button } from '../components/ui-kit/Button';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { useToast } from '../state/ToastContext';
import { AdminInput, AdminSelect } from '../components/admin/AdminField';
import { AdminShell } from '../components/admin/AdminShell';
import { AdminSection } from '../components/admin/AdminSection';
import './AdminDashboard.css';

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: 'PENDING', label: 'Новый' },
  { value: 'PAID', label: 'Оплачен' },
  { value: 'ASSEMBLY', label: 'Сборка' },
  { value: 'READY_FOR_PICKUP', label: 'Готов к выдаче' },
  { value: 'IN_TRANSIT', label: 'В пути' },
  { value: 'RECEIVED', label: 'Получен' },
  { value: 'COMPLETED', label: 'Завершён' },
  { value: 'CANCELLED', label: 'Отменён' },
];

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role ?? null;
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [fromFilter, setFromFilter] = useState<string>('');
  const [toFilter, setToFilter] = useState<string>('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<OrderTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, teamsData] = await Promise.all([
        fetchAdminOrders({
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(teamFilter ? { teamId: teamFilter } : {}),
          ...(userFilter ? { userId: userFilter } : {}),
          ...(fromFilter ? { from: fromFilter } : {}),
          ...(toFilter ? { to: toFilter } : {}),
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
  }, [statusFilter, teamFilter, userFilter, fromFilter, toFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAssignTeam = async (orderId: string, teamId: string) => {
    if (!can(role, 'orders:update')) return;
    try {
      const updated = await assignTeam(orderId, teamId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
      addToast({ type: 'success', message: 'Команда назначена' });
    } catch (err) {
      console.error(err);
      setError('Не удалось назначить команду');
      addToast({ type: 'error', message: 'Ошибка назначения команды' });
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!can(role, 'orders:update')) return;
    try {
      const updated = await updateOrderStatus(orderId, { status });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
      addToast({ type: 'success', message: 'Статус обновлён' });
    } catch (err) {
      console.error(err);
      setError('Не удалось сменить статус');
      addToast({ type: 'error', message: 'Ошибка смены статуса' });
    }
  };

  const handleBulkStatus = async (status: OrderStatus) => {
    if (!can(role, 'orders:update')) return;
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setActionLoading(true);
    try {
      const updated = await bulkUpdateOrderStatus({ orderIds: ids, status });
      setOrders((prev) =>
        prev.map((o) => updated.find((u) => u.id === o.id) ?? o)
      );
      setSelectedIds(new Set());
      addToast({ type: 'success', message: 'Статусы обновлены' });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: 'Ошибка массового обновления статусов',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTimeline = async (orderId: string) => {
    try {
      const tl = await fetchOrderTimeline(orderId);
      const ord = orders.find((o) => o.id === orderId) ?? null;
      setSelected(ord);
      setTimeline(tl);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Не удалось загрузить таймлайн' });
    }
  };

  return (
    <AdminShell title="Заказы" active="orders">
      {error ? <p className="auth-error">{error}</p> : null}
      <div className="admin-filters">
        <AdminSelect
          className="admin-filter__field"
          label="Статус"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter((e.target.value as OrderStatus) || '')
          }
        >
          <option value="">Все статусы</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          className="admin-filter__field"
          label="Команда"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">Все</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          className="admin-filter__field"
          label="Пользователь (id/email)"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          placeholder="UUID или email"
        />
        <AdminInput
          className="admin-filter__field"
          label="С даты"
          type="date"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
        />
        <AdminInput
          className="admin-filter__field"
          label="По дату"
          type="date"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
        />
        <Button variant="secondary" onClick={() => void load()}>
          Обновить
        </Button>
      </div>
      <AdminSection title="Заказы">
        {loading ? <p>Загрузка…</p> : null}
        <div className="admin-orders__list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              leading={
                <input
                  type="checkbox"
                  checked={selectedIds.has(order.id)}
                  onChange={() => toggleSelect(order.id)}
                  aria-label="Выбрать заказ"
                />
              }
              title={`Заказ #${order.id.slice(0, 6)}`}
              meta={
                <>
                  <span>Клиент: {order.customerEmail}</span>
                  <span>Сумма: {order.total} ₽</span>
                </>
              }
              status={<OrderStatusBadge status={order.status} />}
              body={
                <>
                  <div>Команда: {order.team?.name ?? '—'}</div>
                  <div>
                    Создан: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </>
              }
              actions={
                <>
                  {can(role, 'orders:update') ? (
                    <>
                      <select
                        className="auth-input"
                        value={order.team?.id ?? ''}
                        onChange={(e) =>
                          handleAssignTeam(order.id, e.target.value)
                        }
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
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : null}
                  <Button
                    variant="secondary"
                    onClick={() => handleTimeline(order.id)}
                  >
                    Таймлайн
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSelected(order)}
                  >
                    Детали
                  </Button>
                </>
              }
            />
          ))}
        </div>
      </AdminSection>

      {can(role, 'orders:update') && selectedIds.size ? (
        <div className="admin-bulk-actions">
          <span>Массово обновить статус для {selectedIds.size} выбранных:</span>
          <select
            className="auth-input"
            onChange={(e) => {
              const value = e.target.value as OrderStatus;
              if (value) void handleBulkStatus(value);
            }}
            defaultValue=""
            disabled={actionLoading}
          >
            <option value="">Выберите статус</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <OrderDetailsModal
        order={selected}
        isOpen={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setTimeline(null);
        }}
        timeline={timeline}
      />
    </AdminShell>
  );
};
