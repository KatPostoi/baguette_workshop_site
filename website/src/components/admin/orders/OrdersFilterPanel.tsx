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
  onChange: (filters: OrdersFilters) => void;
  onApply: () => void;
  onReset: () => void;
};

export const OrdersFilterPanel = ({
  filters,
  teams,
  loading = false,
  refreshing = false,
  onChange,
  onApply,
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
          <Button onClick={onApply} disabled={loading || refreshing}>
            Применить
          </Button>
          <Button
            variant="secondary"
            onClick={onReset}
            disabled={loading || refreshing}
          >
            Сбросить
          </Button>
        </>
      }
    >
      <AdminInput
        label="Поиск"
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
        placeholder="Заказ, имя клиента"
      />

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
      >
        <option value="">Все команды</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </AdminSelect>

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
