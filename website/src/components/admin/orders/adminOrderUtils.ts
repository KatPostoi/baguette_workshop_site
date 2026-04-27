import type { CatalogItem, Order, OrderStatus } from '../../../api/types';
import { ORDER_STATUS_LABELS } from '../../orders/orderStatusMeta';

export type AdminOrderDialogMode = 'create' | 'edit' | null;

export type AdminOrderDraftItem = {
  key: string;
  catalogItemId: string;
  title: string;
  quantity: number;
};

export type AdminOrderDraft = {
  id: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  teamId: string;
  status: OrderStatus;
  items: AdminOrderDraftItem[];
};

const createDraftKey = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createEmptyAdminOrderDraft = (): AdminOrderDraft => ({
  id: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  teamId: '',
  status: 'PENDING',
  items: [
    {
      key: createDraftKey(),
      catalogItemId: '',
      title: '',
      quantity: 1,
    },
  ],
});

export const createEmptyAdminOrderDraftItem = (): AdminOrderDraftItem => ({
  key: createDraftKey(),
  catalogItemId: '',
  title: '',
  quantity: 1,
});

export const mapOrderToAdminDraft = (order: Order): AdminOrderDraft => ({
  id: order.id,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone ?? '',
  deliveryAddress: order.deliveryAddress ?? '',
  teamId: order.team?.id ?? '',
  status: order.status,
  items: order.items.map((item) => ({
    key: item.id,
    catalogItemId: item.catalogItemId ?? '',
    title: item.title,
    quantity: item.quantity,
  })),
});

export const formatAdminOrderLabel = (order: Pick<Order, 'id'>) =>
  `Заказ #${order.id.slice(0, 6)}`;

export const matchesAdminOrderSearch = (order: Order, search: string) => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  const searchParts = [
    formatAdminOrderLabel(order),
    order.customerName,
  ];

  return searchParts.some((part) =>
    part.toLowerCase().includes(normalizedSearch),
  );
};

export const validateAdminOrderDraft = (
  draft: AdminOrderDraft,
  mode: Exclude<AdminOrderDialogMode, null>,
) => {
  if (draft.customerName.trim().length < 2) {
    return 'Укажите корректное имя клиента.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.customerEmail.trim())) {
    return 'Укажите корректный email клиента.';
  }

  if (
    draft.customerPhone.trim() &&
    !/^[+\d\s()-]{7,}$/.test(draft.customerPhone.trim())
  ) {
    return 'Телефон должен быть в корректном формате.';
  }

  if (mode === 'create') {
    if (!draft.items.length) {
      return 'Добавьте хотя бы одну позицию заказа.';
    }

    if (draft.items.some((item) => !item.catalogItemId)) {
      return 'Выберите товар каталога для каждой позиции.';
    }

    if (draft.items.some((item) => item.quantity <= 0)) {
      return 'Количество в каждой позиции должно быть больше нуля.';
    }
  }

  return null;
};

export const resolveCatalogItemTitle = (
  catalog: CatalogItem[],
  catalogItemId: string,
) =>
  catalog.find((item) => item.id === catalogItemId)?.title ??
  catalogItemId;

export const getAdminOrderStatusLabel = (status: OrderStatus) =>
  ORDER_STATUS_LABELS[status];
