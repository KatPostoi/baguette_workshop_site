import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchAdminOrders,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  fetchOrderTimeline,
} from '../api/orders';
import { ApiError } from '../api/httpClient';
import { assignTeamToOrder, fetchTeams } from '../api/teams';
import type { Order, OrderStatus, Team, OrderTimeline } from '../api/types';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { useToast } from '../state/ToastContext';
import { AdminListBlock } from '../components/admin/AdminListBlock';
import { AdminListState } from '../components/admin/AdminListState';
import { AdminPageLayout } from '../components/admin/AdminPageLayout';
import { AdminShell } from '../components/admin/AdminShell';
import { OrdersFilterPanel } from '../components/admin/orders/OrdersFilterPanel';
import { OrdersBulkActions } from '../components/admin/orders/OrdersBulkActions';
import { OrdersList } from '../components/admin/orders/OrdersList';
import { createEmptyOrdersFilters } from '../components/admin/orders/ordersFilters';
import './AdminDashboard.css';

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role ?? null;
  const { addToast } = useToast();
  const canUpdateOrders = can(role, 'orders:update');
  const [orders, setOrders] = useState<Order[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState(createEmptyOrdersFilters);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<OrderTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [statusLoadingOrderId, setStatusLoadingOrderId] = useState<string | null>(
    null,
  );
  const [teamLoadingOrderId, setTeamLoadingOrderId] = useState<string | null>(
    null,
  );
  const [timelineLoadingOrderId, setTimelineLoadingOrderId] = useState<
    string | null
  >(null);
  const hasLoadedOrdersRef = useRef(false);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const loadOrders = useCallback(async () => {
    setOrdersError(null);

    if (hasLoadedOrdersRef.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const ordersData = await fetchAdminOrders({
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.teamId ? { teamId: filters.teamId } : {}),
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.from ? { from: filters.from } : {}),
        ...(filters.to ? { to: filters.to } : {}),
      });

      setOrders(ordersData);
      hasLoadedOrdersRef.current = true;
      setSelectedIds((current) => {
        if (!current.size) {
          return current;
        }

        const availableIds = new Set(ordersData.map((order) => order.id));
        return new Set(
          Array.from(current).filter((orderId) => availableIds.has(orderId)),
        );
      });

    } catch (err) {
      console.error(err);
      setOrdersError(
        getErrorMessage(
          err,
          'Не удалось загрузить заказы. Проверьте фильтры и доступность API.',
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (selectedOrderId && !selectedOrder) {
      setSelectedOrderId(null);
      setTimeline(null);
    }
  }, [selectedOrder, selectedOrderId]);

  const loadTeams = useCallback(async () => {
    setTeamsError(null);

    try {
      setTeams(await fetchTeams());
    } catch (err) {
      console.error(err);
      const message = getErrorMessage(
        err,
        'Не удалось загрузить рабочие группы.',
      );
      setTeamsError(message);
      addToast({ type: 'error', message });
    }
  }, [addToast]);

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  const handleAssignTeam = async (orderId: string, teamId: string) => {
    if (!canUpdateOrders || !teamId) return;

    setTeamLoadingOrderId(orderId);

    try {
      const updated = await assignTeamToOrder(orderId, teamId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      addToast({ type: 'success', message: 'Команда назначена' });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: getErrorMessage(err, 'Ошибка назначения команды'),
      });
    } finally {
      setTeamLoadingOrderId(null);
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!canUpdateOrders) return;

    setStatusLoadingOrderId(orderId);

    try {
      const updated = await updateOrderStatus(orderId, { status });
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      addToast({ type: 'success', message: 'Статус обновлён' });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: getErrorMessage(err, 'Ошибка смены статуса'),
      });
    } finally {
      setStatusLoadingOrderId(null);
    }
  };

  const handleBulkStatus = async (status: OrderStatus) => {
    if (!canUpdateOrders) return;
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setBulkLoading(true);
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
        message: getErrorMessage(err, 'Ошибка массового обновления статусов'),
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    if (!canUpdateOrders) {
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTimeline = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setTimeline(null);
    setTimelineLoadingOrderId(orderId);

    try {
      const tl = await fetchOrderTimeline(orderId);
      setTimeline(tl);
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: getErrorMessage(err, 'Не удалось загрузить таймлайн'),
      });
    } finally {
      setTimelineLoadingOrderId(null);
    }
  };

  const resetFilters = () => {
    setFilters(createEmptyOrdersFilters());
  };

  return (
    <AdminShell title="Заказы" active="orders">
      <AdminPageLayout>
        <OrdersFilterPanel
          filters={filters}
          teams={teams}
          loading={loading}
          refreshing={refreshing}
          teamsError={teamsError}
          onChange={setFilters}
          onRefresh={() => void loadOrders()}
          onReset={resetFilters}
        />

        <AdminListBlock
          title="Заказы"
          description="Эталонная admin-страница: card-based список заказов, общий shell-контракт, честные фильтры и действия, ограниченные теми переходами статусов, которые реально поддерживает backend."
          actions={
            canUpdateOrders ? (
              <OrdersBulkActions
                selectedCount={selectedIds.size}
                loading={bulkLoading}
                disabled={loading || refreshing}
                onApplyStatus={(status) => void handleBulkStatus(status)}
                onClearSelection={() => setSelectedIds(new Set())}
              />
            ) : null
          }
        >
          <AdminListState
            loading={loading}
            error={ordersError}
            isEmpty={!orders.length}
            loadingMessage="Загружаем заказы…"
            emptyMessage="Заказы по текущим фильтрам не найдены."
          >
            <OrdersList
              orders={orders}
              teams={teams}
              selectedIds={selectedIds}
              canUpdateOrders={canUpdateOrders}
              bulkLoading={bulkLoading}
              statusLoadingOrderId={statusLoadingOrderId}
              teamLoadingOrderId={teamLoadingOrderId}
              timelineLoadingOrderId={timelineLoadingOrderId}
              onToggleSelect={toggleSelect}
              onAssignTeam={(orderId, teamId) =>
                void handleAssignTeam(orderId, teamId)
              }
              onChangeStatus={(orderId, status) =>
                void handleStatusChange(orderId, status)
              }
              onOpenTimeline={(orderId) => void handleTimeline(orderId)}
              onOpenDetails={(orderId) => {
                setSelectedOrderId(orderId);
                setTimeline(null);
              }}
            />
          </AdminListState>
        </AdminListBlock>
      </AdminPageLayout>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => {
          setSelectedOrderId(null);
          setTimeline(null);
        }}
        timeline={timeline}
        timelineLoading={
          Boolean(selectedOrderId) && timelineLoadingOrderId === selectedOrderId
        }
      />
    </AdminShell>
  );
};
