import { Button } from '../../ui-kit/Button';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminFilterPanel } from '../AdminFilterPanel';
import type { Team, OrderStatus } from '../../../api/types';
import { ORDER_STATUS_OPTIONS } from '../../orders/orderStatusMeta';
import type { OrdersFilters } from './ordersFilters';

type OrdersFilterPanelProps = {
  filters: OrdersFilters;
  teams: Team[];
  loading?: boolean;
  refreshing?: boolean;
  teamsError?: string | null;
  onChange: (filters: OrdersFilters) => void;
  onRefresh: () => void;
  onReset: () => void;
};

export const OrdersFilterPanel = ({
  filters,
  teams,
  loading = false,
  refreshing = false,
  teamsError,
  onChange,
  onRefresh,
  onReset,
}: OrdersFilterPanelProps) => {
  const updateFilter = <TKey extends keyof OrdersFilters>(
    key: TKey,
    value: OrdersFilters[TKey],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <AdminFilterPanel
      actions={
        <>
          <Button
            variant="ghost"
            onClick={onReset}
            disabled={loading || refreshing}
          >
            Сбросить
          </Button>
          <Button
            variant="secondary"
            onClick={onRefresh}
            loading={refreshing}
            disabled={loading}
          >
            Обновить
          </Button>
        </>
      }
    >
      <AdminSelect
        label="Статус"
        value={filters.status}
        onChange={(event) =>
          updateFilter('status', (event.target.value as OrderStatus) || '')
        }
      >
        <option value="">Все статусы</option>
        {ORDER_STATUS_OPTIONS.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </AdminSelect>

      <AdminSelect
        label="Команда"
        value={filters.teamId}
        onChange={(event) => updateFilter('teamId', event.target.value)}
        disabled={!teams.length}
        helper={teamsError ?? 'Фильтр работает только по активным рабочим группам.'}
      >
        <option value="">Все команды</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </AdminSelect>

      <AdminInput
        label="Пользователь (UUID)"
        value={filters.userId}
        onChange={(event) => updateFilter('userId', event.target.value)}
        placeholder="UUID пользователя"
        helper="Текущий backend-фильтр принимает только UUID пользователя."
      />

      <AdminInput
        label="С даты"
        type="date"
        value={filters.from}
        onChange={(event) => updateFilter('from', event.target.value)}
      />

      <AdminInput
        label="По дату"
        type="date"
        value={filters.to}
        onChange={(event) => updateFilter('to', event.target.value)}
      />
    </AdminFilterPanel>
  );
};
