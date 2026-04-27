import type { Order } from '../../../api/types';
import { OrderStatusBadge } from '../../orders/OrderStatusBadge';
import { AdminTable } from '../AdminTable';
import { OrderAdminActions } from './OrderAdminActions';
import { formatAdminOrderLabel } from './adminOrderUtils';

type OrdersListProps = {
  orders: Order[];
  canUpdateOrders: boolean;
  actionLoadingOrderId?: string | null;
  onEditOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
};

export const OrdersList = ({
  orders,
  canUpdateOrders,
  actionLoadingOrderId = null,
  onEditOrder,
  onDeleteOrder,
}: OrdersListProps) => (
  <AdminTable
    headers={[
      'Заказ',
      'Клиент',
      'Контакты',
      'Доставка',
      'Команда',
      'Статус',
      'Действия',
    ]}
    className="admin-orders-table"
  >
    {orders.map((order) => (
      <div key={order.id} className="admin-table__row">
        <div className="admin-orders-table__identity">
          <span className="admin-orders-table__name">
            {formatAdminOrderLabel(order)}
          </span>
        </div>

        <div className="admin-orders-table__cell">
          <span className="admin-orders-table__name">{order.customerName}</span>
        </div>

        <div className="admin-orders-table__cell">
          <span>{order.customerEmail}</span>
          <span>{order.customerPhone ?? '—'}</span>
        </div>

        <div className="admin-orders-table__cell">
          <span>{order.deliveryAddress || 'Самовывоз / не указан'}</span>
        </div>

        <div className="admin-orders-table__cell">
          <span>{order.team?.name ?? 'Не назначена'}</span>
        </div>

        <div className="admin-orders-table__cell">
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="admin-orders-table__action-cell">
          <OrderAdminActions
            order={order}
            canUpdateOrders={canUpdateOrders}
            loading={actionLoadingOrderId === order.id}
            onEdit={onEditOrder}
            onDelete={onDeleteOrder}
          />
        </div>
      </div>
    ))}
  </AdminTable>
);
