import type { Order, Team, OrderStatus } from '../../../api/types';
import { OrderCard } from '../../orders/OrderCard';
import { OrderStatusBadge } from '../../orders/OrderStatusBadge';
import { OrderAdminActions } from './OrderAdminActions';

type OrdersListProps = {
  orders: Order[];
  teams: Team[];
  selectedIds: Set<string>;
  canUpdateOrders: boolean;
  bulkLoading?: boolean;
  statusLoadingOrderId?: string | null;
  teamLoadingOrderId?: string | null;
  timelineLoadingOrderId?: string | null;
  onToggleSelect: (id: string) => void;
  onAssignTeam: (orderId: string, teamId: string) => void;
  onChangeStatus: (orderId: string, status: OrderStatus) => void;
  onOpenTimeline: (orderId: string) => void;
  onOpenDetails: (orderId: string) => void;
};

const formatOrderMeta = (order: Order) => [
  `Клиент: ${order.customerEmail}`,
  `Сумма: ${order.total} ₽`,
  `Позиций: ${order.items.length}`,
];

export const OrdersList = ({
  orders,
  teams,
  selectedIds,
  canUpdateOrders,
  bulkLoading = false,
  statusLoadingOrderId = null,
  teamLoadingOrderId = null,
  timelineLoadingOrderId = null,
  onToggleSelect,
  onAssignTeam,
  onChangeStatus,
  onOpenTimeline,
  onOpenDetails,
}: OrdersListProps) => (
  <div className="admin-orders__list">
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        leading={
          canUpdateOrders ? (
            <input
              type="checkbox"
              checked={selectedIds.has(order.id)}
              onChange={() => onToggleSelect(order.id)}
              aria-label={`Выбрать заказ ${order.id}`}
              disabled={bulkLoading}
            />
          ) : null
        }
        title={`Заказ #${order.id.slice(0, 6)}`}
        meta={formatOrderMeta(order).map((item) => (
          <span key={item}>{item}</span>
        ))}
        status={<OrderStatusBadge status={order.status} />}
        body={
          <>
            <div className="admin-orders__body-line">
              <span>Получатель: {order.customerName}</span>
              <span>Телефон: {order.customerPhone ?? '—'}</span>
            </div>
            <div className="admin-orders__body-line">
              <span>Команда: {order.team?.name ?? 'Не назначена'}</span>
              <span>Создан: {new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="admin-orders__body-line">
              <span>
                Доставка:{' '}
                {order.deliveryAddress ? order.deliveryAddress : 'Самовывоз / не указан'}
              </span>
            </div>
          </>
        }
        actions={
          <OrderAdminActions
            order={order}
            teams={teams}
            canUpdateOrders={canUpdateOrders}
            teamLoading={teamLoadingOrderId === order.id}
            statusLoading={statusLoadingOrderId === order.id}
            timelineLoading={timelineLoadingOrderId === order.id}
            onAssignTeam={onAssignTeam}
            onChangeStatus={onChangeStatus}
            onOpenTimeline={onOpenTimeline}
            onOpenDetails={onOpenDetails}
          />
        }
      />
    ))}
  </div>
);
