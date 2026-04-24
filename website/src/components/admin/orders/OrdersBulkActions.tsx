import { useEffect, useState } from 'react';
import type { OrderStatus } from '../../../api/types';
import { ORDER_STATUS_OPTIONS } from '../../orders/orderStatusMeta';
import { Button } from '../../ui-kit/Button';

type OrdersBulkActionsProps = {
  selectedCount: number;
  loading?: boolean;
  disabled?: boolean;
  onApplyStatus: (status: OrderStatus) => void;
  onClearSelection: () => void;
};

export const OrdersBulkActions = ({
  selectedCount,
  loading = false,
  disabled = false,
  onApplyStatus,
  onClearSelection,
}: OrdersBulkActionsProps) => {
  const [status, setStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    if (!selectedCount) {
      setStatus('');
    }
  }, [selectedCount]);

  if (!selectedCount) {
    return null;
  }

  return (
    <div className="admin-dashboard__bulk-actions">
      <span className="admin-dashboard__bulk-summary">
        Выбрано: {selectedCount}
      </span>
      <select
        className="auth-input admin-dashboard__bulk-select"
        value={status}
        onChange={(event) => setStatus(event.target.value as OrderStatus)}
        disabled={disabled || loading}
      >
        <option value="">Выберите статус</option>
        {ORDER_STATUS_OPTIONS.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        loading={loading}
        disabled={!status || disabled}
        onClick={() => status && onApplyStatus(status)}
      >
        Применить
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={loading}
        onClick={onClearSelection}
      >
        Снять выбор
      </Button>
    </div>
  );
};
