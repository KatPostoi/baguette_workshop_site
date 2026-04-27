import type { Order } from '../../../api/types';
import { Button } from '../../ui-kit/Button';
import { AdminRowActions } from '../AdminRowActions';

type OrderAdminActionsProps = {
  order: Order;
  canUpdateOrders: boolean;
  loading?: boolean;
  onEdit: (orderId: string) => void;
  onDelete: (orderId: string) => void;
};

export const OrderAdminActions = ({
  order,
  canUpdateOrders,
  loading = false,
  onEdit,
  onDelete,
}: OrderAdminActionsProps) => {
  return (
    <AdminRowActions className="admin-table__actions admin-orders-table__actions">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onEdit(order.id)}
        disabled={!canUpdateOrders || loading}
      >
        Редактировать
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onDelete(order.id)}
        disabled={!canUpdateOrders || loading}
      >
        Удалить
      </Button>
    </AdminRowActions>
  );
};
