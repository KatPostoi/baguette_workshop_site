import type { Order, Team, OrderStatus } from '../../../api/types';
import { getOrderStatusOptions } from '../../orders/orderStatusMeta';
import { Button } from '../../ui-kit/Button';
import { AdminRowActions } from '../AdminRowActions';

type OrderAdminActionsProps = {
  order: Order;
  teams: Team[];
  canUpdateOrders: boolean;
  teamLoading?: boolean;
  statusLoading?: boolean;
  timelineLoading?: boolean;
  onAssignTeam: (orderId: string, teamId: string) => void;
  onChangeStatus: (orderId: string, status: OrderStatus) => void;
  onOpenTimeline: (orderId: string) => void;
  onOpenDetails: (orderId: string) => void;
};

export const OrderAdminActions = ({
  order,
  teams,
  canUpdateOrders,
  teamLoading = false,
  statusLoading = false,
  timelineLoading = false,
  onAssignTeam,
  onChangeStatus,
  onOpenTimeline,
  onOpenDetails,
}: OrderAdminActionsProps) => {
  const statusOptions = getOrderStatusOptions(order);
  const statusDisabled = !canUpdateOrders || statusLoading || statusOptions.length <= 1;
  const teamDisabled = !canUpdateOrders || teamLoading || !teams.length;

  return (
    <AdminRowActions>
      {canUpdateOrders ? (
        <>
          <select
            className="auth-input admin-orders__action-select"
            value={order.team?.id ?? ''}
            onChange={(event) => {
              const nextTeamId = event.target.value;
              if (nextTeamId && nextTeamId !== order.team?.id) {
                onAssignTeam(order.id, nextTeamId);
              }
            }}
            disabled={teamDisabled}
            aria-label={`Назначить команду заказу ${order.id}`}
          >
            <option value="">Назначить команду</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            className="auth-input admin-orders__action-select"
            value={order.status}
            onChange={(event) => {
              const nextStatus = event.target.value as OrderStatus;
              if (nextStatus !== order.status) {
                onChangeStatus(order.id, nextStatus);
              }
            }}
            disabled={statusDisabled}
            aria-label={`Изменить статус заказа ${order.id}`}
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </>
      ) : null}

      <Button
        size="sm"
        variant="secondary"
        onClick={() => onOpenTimeline(order.id)}
        loading={timelineLoading}
      >
        Таймлайн
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onOpenDetails(order.id)}
      >
        Детали
      </Button>
    </AdminRowActions>
  );
};
