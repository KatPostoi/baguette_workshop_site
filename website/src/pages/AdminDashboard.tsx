import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminListCatalog } from '../api/catalog';
import {
  createAdminOrder,
  deleteAdminOrder,
  fetchAdminOrders,
  updateAdminOrder,
} from '../api/orders';
import { ApiError } from '../api/httpClient';
import { adminListTeams } from '../api/teams';
import type { CatalogItem, Order, Team } from '../api/types';
import { getAvailableOrderStatuses } from '../components/orders/orderStatusMeta';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { useToast } from '../state/ToastContext';
import { AdminCreateButton } from '../components/admin/AdminCreateButton';
import { AdminListBlock } from '../components/admin/AdminListBlock';
import { AdminListState } from '../components/admin/AdminListState';
import { AdminPageLayout } from '../components/admin/AdminPageLayout';
import {
  AdminPaginationControls,
  AdminPaginationInfo,
} from '../components/admin/AdminPagination';
import { AdminShell } from '../components/admin/AdminShell';
import { DEFAULT_ADMIN_PAGE_SIZE } from '../components/admin/adminCrudUtils';
import { AdminConfirmDialog } from '../components/admin/forms/AdminConfirmDialog';
import { AdminEntityDialog } from '../components/admin/forms/AdminEntityDialog';
import { AdminOrderEditForm } from '../components/admin/orders/AdminOrderEditForm';
import {
  createEmptyAdminOrderDraft,
  mapOrderToAdminDraft,
  matchesAdminOrderSearch,
  validateAdminOrderDraft,
  type AdminOrderDialogMode,
  type AdminOrderDraft,
} from '../components/admin/orders/adminOrderUtils';
import { OrdersFilterPanel } from '../components/admin/orders/OrdersFilterPanel';
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
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filters, setFilters] = useState(createEmptyOrdersFilters);
  const [appliedFilters, setAppliedFilters] = useState(createEmptyOrdersFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<AdminOrderDialogMode>(null);
  const [draft, setDraft] = useState<AdminOrderDraft>(createEmptyAdminOrderDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const hasLoadedOrdersRef = useRef(false);

  const selectedOrder = useMemo(
    () => (draft.id ? orders.find((order) => order.id === draft.id) ?? null : null),
    [draft.id, orders],
  );

  const filteredOrders = useMemo(() => {
    const fromTimestamp = appliedFilters.from
      ? new Date(`${appliedFilters.from}T00:00:00`).getTime()
      : null;
    const toTimestamp = appliedFilters.to
      ? new Date(`${appliedFilters.to}T23:59:59.999`).getTime()
      : null;

    return orders.filter((order) => {
      if (!matchesAdminOrderSearch(order, appliedFilters.search)) {
        return false;
      }

      if (appliedFilters.status && order.status !== appliedFilters.status) {
        return false;
      }

      if (appliedFilters.teamId && order.team?.id !== appliedFilters.teamId) {
        return false;
      }

      const createdAtTimestamp = new Date(order.createdAt).getTime();

      if (fromTimestamp !== null && createdAtTimestamp < fromTimestamp) {
        return false;
      }

      if (toTimestamp !== null && createdAtTimestamp > toTimestamp) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, orders]);

  const paginatedOrders = useMemo(
    () =>
      filteredOrders.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [filteredOrders, page],
  );

  const availableStatusOptions = useMemo(() => {
    if (!selectedOrder) {
      return ['PENDING'] as const;
    }

    return [
      selectedOrder.status,
      ...getAvailableOrderStatuses({
        status: selectedOrder.status,
        deliveryAddress: draft.deliveryAddress.trim() || null,
      }),
    ].filter((status, index, items) => items.indexOf(status) === index);
  }, [draft.deliveryAddress, selectedOrder]);

  const loadOrders = useCallback(async () => {
    setOrdersError(null);

    if (hasLoadedOrdersRef.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const ordersData = await fetchAdminOrders();
      setOrders(ordersData);
      hasLoadedOrdersRef.current = true;
    } catch (error) {
      console.error(error);
      setOrdersError(
        getErrorMessage(
          error,
          'Не удалось загрузить заказы. Проверьте доступность API.',
        ),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadReferences = useCallback(async () => {
    try {
      const [catalogItems, activeTeams] = await Promise.all([
        adminListCatalog(),
        adminListTeams({ includeInactive: true }),
      ]);

      setCatalog(catalogItems);
      setTeams(activeTeams);
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        message: getErrorMessage(
          error,
          'Не удалось загрузить каталог или рабочие группы для редактирования заказов.',
        ),
      });
    }
  }, [addToast]);

  useEffect(() => {
    void Promise.all([loadOrders(), loadReferences()]);
  }, [loadOrders, loadReferences]);

  useEffect(() => {
    if (dialogMode === 'edit' && draft.id && !selectedOrder) {
      setDialogMode(null);
      setDraft(createEmptyAdminOrderDraft());
    }
  }, [dialogMode, draft.id, selectedOrder]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredOrders.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredOrders.length, page]);

  const updateDraft = <TKey extends keyof AdminOrderDraft>(
    key: TKey,
    value: AdminOrderDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const resetFilters = () => {
    const nextFilters = createEmptyOrdersFilters();
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  const openCreateDialog = () => {
    setDraft(createEmptyAdminOrderDraft());
    setDialogMode('create');
  };

  const openEditDialog = (order: Order) => {
    setDraft(mapOrderToAdminDraft(order));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogMode(null);
    setDraft(createEmptyAdminOrderDraft());
  };

  const handleSave = async () => {
    if (!dialogMode) {
      return;
    }

    const validationError = validateAdminOrderDraft(draft, dialogMode);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'create') {
        const created = await createAdminOrder({
          customerName: draft.customerName.trim(),
          customerEmail: draft.customerEmail.trim(),
          customerPhone: draft.customerPhone.trim() || null,
          deliveryAddress: draft.deliveryAddress.trim() || null,
          teamId: draft.teamId || null,
          items: draft.items.map((item) => ({
            catalogItemId: item.catalogItemId,
            quantity: item.quantity,
          })),
        });

        setOrders((current) => [created, ...current]);
        setPage(1);
        addToast({ type: 'success', message: 'Заказ создан.' });
      } else if (dialogMode === 'edit' && draft.id) {
        const updated = await updateAdminOrder(draft.id, {
          customerName: draft.customerName.trim(),
          customerEmail: draft.customerEmail.trim(),
          customerPhone: draft.customerPhone.trim() || null,
          deliveryAddress: draft.deliveryAddress.trim() || null,
          teamId: draft.teamId || null,
          status: draft.status,
        });

        setOrders((current) =>
          current.map((order) => (order.id === updated.id ? updated : order)),
        );
        addToast({ type: 'success', message: 'Заказ обновлён.' });
      }

      setDialogMode(null);
      setDraft(createEmptyAdminOrderDraft());
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        message: getErrorMessage(error, 'Не удалось сохранить заказ.'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    setDeleting(true);

    try {
      await deleteAdminOrder(deleteCandidate.id);
      setOrders((current) =>
        current.filter((order) => order.id !== deleteCandidate.id),
      );

      if (draft.id === deleteCandidate.id) {
        setDialogMode(null);
        setDraft(createEmptyAdminOrderDraft());
      }

      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Заказ удалён.' });
    } catch (error) {
      console.error(error);
      addToast({
        type: 'error',
        message: getErrorMessage(error, 'Не удалось удалить заказ.'),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell active="orders">
      <AdminPageLayout>
        <OrdersFilterPanel
          filters={filters}
          teams={teams}
          loading={loading}
          refreshing={refreshing}
          onChange={setFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <AdminListBlock
          primaryAction={
            canUpdateOrders ? (
              <AdminCreateButton
                onClick={openCreateDialog}
                disabled={loading || refreshing || saving || deleting}
              />
            ) : null
          }
          centerContent={
            <AdminPaginationInfo
              total={filteredOrders.length}
              page={page}
              pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            />
          }
          actions={
            <AdminPaginationControls
              total={filteredOrders.length}
              page={page}
              pageSize={DEFAULT_ADMIN_PAGE_SIZE}
              onChange={setPage}
            />
          }
        >
          <AdminListState
            loading={loading}
            error={ordersError}
            isEmpty={!filteredOrders.length}
            loadingMessage="Загружаем заказы…"
            emptyMessage="Заказы по текущим фильтрам не найдены."
          >
            <OrdersList
              orders={paginatedOrders}
              canUpdateOrders={canUpdateOrders}
              actionLoadingOrderId={
                deleting && deleteCandidate ? deleteCandidate.id : null
              }
              onEditOrder={(orderId) => {
                const order = orders.find((item) => item.id === orderId);

                if (order) {
                  openEditDialog(order);
                }
              }}
              onDeleteOrder={(orderId) => {
                const order = orders.find((item) => item.id === orderId);

                if (order) {
                  setDeleteCandidate(order);
                }
              }}
            />
          </AdminListState>
        </AdminListBlock>
      </AdminPageLayout>

      <AdminEntityDialog
        isOpen={dialogMode !== null}
        title={
          dialogMode === 'edit' ? 'Редактировать заказ' : 'Создать заказ'
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить заказ' : 'Создать заказ'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        <AdminOrderEditForm
          mode={dialogMode === 'edit' ? 'edit' : 'create'}
          draft={draft}
          catalog={catalog}
          teams={teams}
          statusOptions={[...availableStatusOptions]}
          onChange={updateDraft}
        />
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={deleteCandidate !== null}
        title="Удалить заказ?"
        description={
          deleteCandidate
            ? `Заказ ${deleteCandidate.id} будет удалён из базы данных вместе с привязанной историей и уведомлениями.`
            : ''
        }
        confirmLabel="Удалить заказ"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleting) {
            setDeleteCandidate(null);
          }
        }}
      />
    </AdminShell>
  );
};
