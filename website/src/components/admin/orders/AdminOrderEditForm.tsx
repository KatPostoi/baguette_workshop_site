import { Button } from '../../ui-kit/Button';
import { AdminInput, AdminSelect, AdminTextarea } from '../AdminField';
import type { CatalogItem, OrderStatus, Team } from '../../../api/types';
import {
  createEmptyAdminOrderDraftItem,
  getAdminOrderStatusLabel,
  resolveCatalogItemTitle,
  type AdminOrderDraft,
  type AdminOrderDraftItem,
} from './adminOrderUtils';

type AdminOrderEditFormProps = {
  mode: 'create' | 'edit';
  draft: AdminOrderDraft;
  catalog: CatalogItem[];
  teams: Team[];
  statusOptions: OrderStatus[];
  onChange: <TKey extends keyof AdminOrderDraft>(
    key: TKey,
    value: AdminOrderDraft[TKey],
  ) => void;
};

export const AdminOrderEditForm = ({
  mode,
  draft,
  catalog,
  teams,
  statusOptions,
  onChange,
}: AdminOrderEditFormProps) => {
  const updateItem = (
    itemKey: string,
    key: keyof AdminOrderDraftItem,
    value: AdminOrderDraftItem[keyof AdminOrderDraftItem],
  ) => {
    onChange(
      'items',
      draft.items.map((item) =>
        item.key === itemKey
          ? {
              ...item,
              [key]: value,
              ...(key === 'catalogItemId'
                ? {
                    title: resolveCatalogItemTitle(
                      catalog,
                      String(value),
                    ),
                  }
                : {}),
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    onChange('items', [...draft.items, createEmptyAdminOrderDraftItem()]);
  };

  const removeItem = (itemKey: string) => {
    onChange(
      'items',
      draft.items.filter((item) => item.key !== itemKey),
    );
  };

  return (
    <>
      <div className="admin-dialog__form-grid">
        <AdminInput
          label="ФИО клиента"
          value={draft.customerName}
          onChange={(event) => onChange('customerName', event.target.value)}
        />
        <AdminInput
          label="Email клиента"
          value={draft.customerEmail}
          onChange={(event) => onChange('customerEmail', event.target.value)}
        />
        <AdminInput
          label="Телефон"
          value={draft.customerPhone}
          onChange={(event) => onChange('customerPhone', event.target.value)}
        />
        <AdminSelect
          label="Команда"
          value={draft.teamId}
          onChange={(event) => onChange('teamId', event.target.value)}
        >
          <option value="">Не назначена</option>
          {teams.map((team) => (
            <option
              key={team.id}
              value={team.id}
              disabled={!team.active && team.id !== draft.teamId}
            >
              {team.name}
              {!team.active ? ' (неактивна)' : ''}
            </option>
          ))}
        </AdminSelect>

        {mode === 'edit' ? (
          <AdminSelect
            label="Статус"
            value={draft.status}
            onChange={(event) =>
              onChange('status', event.target.value as OrderStatus)
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getAdminOrderStatusLabel(status)}
              </option>
            ))}
          </AdminSelect>
        ) : null}

        <AdminTextarea
          className="admin-field--full"
          label="Адрес доставки"
          value={draft.deliveryAddress}
          onChange={(event) => onChange('deliveryAddress', event.target.value)}
          placeholder="Оставьте пустым для самовывоза"
        />
      </div>

      {mode === 'create' ? (
        <div className="admin-dialog__stack">
          <div className="admin-dialog__section-header">
            <span className="admin-dialog__section-title">Позиции заказа</span>
            <Button type="button" size="sm" variant="secondary" onClick={addItem}>
              Добавить позицию
            </Button>
          </div>

          {draft.items.map((item, index) => (
            <div key={item.key} className="admin-dialog__form-grid">
              <AdminSelect
                className="admin-field--full"
                label={`Товар #${index + 1}`}
                value={item.catalogItemId}
                onChange={(event) =>
                  updateItem(item.key, 'catalogItemId', event.target.value)
                }
              >
                <option value="">Выберите товар</option>
                {catalog.map((catalogItem) => (
                  <option key={catalogItem.id} value={catalogItem.id}>
                    {catalogItem.title}
                  </option>
                ))}
              </AdminSelect>
              <AdminInput
                label="Количество"
                type="number"
                value={item.quantity}
                onChange={(event) =>
                  updateItem(item.key, 'quantity', Number(event.target.value))
                }
              />
              <div className="admin-dialog__inline-action">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => removeItem(item.key)}
                  disabled={draft.items.length <= 1}
                >
                  Удалить позицию
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-dialog__stack">
          <span className="admin-dialog__section-title">Позиции заказа</span>
          {draft.items.map((item, index) => (
            <div key={item.key} className="admin-dialog__summary-row">
              <span className="admin-dialog__summary-label">Позиция #{index + 1}</span>
              <span className="admin-dialog__summary-value">
                {item.title} × {item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
