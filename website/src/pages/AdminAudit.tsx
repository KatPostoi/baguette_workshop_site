import { useCallback, useEffect, useState } from 'react';
import { fetchAuditEvents } from '../api/audit';
import type { AuditEvent } from '../api/types';
import { Button } from '../components/ui-kit/Button';
import { useToast } from '../state/ToastContext';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { AdminPagination } from '../components/admin/AdminPagination';
import { AdminInput, AdminSelect } from '../components/admin/AdminField';
import { AdminShell } from '../components/admin/AdminShell';
import { AdminSection } from '../components/admin/AdminSection';
import { AdminTable } from '../components/admin/AdminTable';
import './AdminAudit.css';

const ENTITY_OPTIONS = [
  { value: '', label: 'Любая' },
  { value: 'Order', label: 'Заказ' },
  { value: 'OrderStatusHistory', label: 'История статусов' },
  { value: 'CatalogItem', label: 'Каталог' },
  { value: 'FrameMaterial', label: 'Материал' },
  { value: 'FrameStyle', label: 'Стиль' },
  { value: 'ServiceItem', label: 'Услуга' },
  { value: 'Team', label: 'Команда' },
  { value: 'User', label: 'Пользователь' },
  { value: 'Auth', label: 'Аутентификация' },
];

const ACTION_OPTIONS = [
  { value: '', label: 'Любое' },
  { value: 'order_status_change', label: 'Смена статуса заказа' },
  { value: 'order_assign_team', label: 'Назначение команды' },
  { value: 'catalog_create', label: 'Создание каталога' },
  { value: 'catalog_update', label: 'Обновление каталога' },
  { value: 'catalog_delete', label: 'Удаление каталога' },
  { value: 'material_create', label: 'Создание материала' },
  { value: 'material_update', label: 'Обновление материала' },
  { value: 'material_delete', label: 'Удаление материала' },
  { value: 'style_create', label: 'Создание стиля' },
  { value: 'style_update', label: 'Обновление стиля' },
  { value: 'style_delete', label: 'Удаление стиля' },
  { value: 'service_create', label: 'Создание услуги' },
  { value: 'service_update', label: 'Обновление услуги' },
  { value: 'service_delete', label: 'Удаление услуги' },
  { value: 'login', label: 'Вход' },
  { value: 'logout', label: 'Выход' },
  { value: 'refresh', label: 'Обновление токена' },
];

export const AdminAuditPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const role = user?.role ?? null;

  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<{
    actorId: string;
    entity: string;
    action: string;
    from: string;
    to: string;
    limit: string;
  }>({
    actorId: '',
    entity: '',
    action: '',
    from: '',
    to: '',
    limit: '10',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!can(role, 'audit:read')) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditEvents({
        actorId: filters.actorId || undefined,
        entity: filters.entity || undefined,
        action: filters.action || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        limit: filters.limit ? Number(filters.limit) : undefined,
        offset,
      });
      setEvents(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить события аудита');
      addToast({ type: 'error', message: 'Ошибка загрузки аудита' });
    } finally {
      setLoading(false);
    }
  }, [role, filters, addToast, offset]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!can(role, 'audit:read')) {
    return <div className="auth-page">Недостаточно прав для просмотра аудита.</div>;
  }

  return (
    <AdminShell title="Аудит" active="audit">
      {error ? <p className="auth-error">{error}</p> : null}
      <div className="admin-filters">
        <AdminInput
          className="admin-filter__field"
          label="Пользователь (email)"
          value={filters.actorId}
          onChange={(e) => setFilters((prev) => ({ ...prev, actorId: e.target.value }))}
          placeholder="email@example.com"
        />
        <AdminSelect
          className="admin-filter__field"
          label="Сущность"
          value={filters.entity}
          onChange={(e) => setFilters((prev) => ({ ...prev, entity: e.target.value }))}
        >
          {ENTITY_OPTIONS.map((opt) => (
            <option key={opt.value || 'any'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          className="admin-filter__field"
          label="Действие"
          value={filters.action}
          onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value || 'any'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          className="admin-filter__field"
          label="С даты"
          type="datetime-local"
          value={filters.from}
          onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
        />
        <AdminInput
          className="admin-filter__field"
          label="По дату"
          type="datetime-local"
          value={filters.to}
          onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
        />
        <AdminInput
          className="admin-filter__field"
          label="Лимит"
          type="number"
          min="1"
          max="500"
          value={filters.limit}
          onChange={(e) => setFilters((prev) => ({ ...prev, limit: e.target.value }))}
        />
        <Button variant="secondary" onClick={() => void load()} disabled={loading}>
          Обновить
        </Button>
      </div>
      <div className="admin-filters">
        <AdminInput
          className="admin-filter__field"
          label="Смещение"
          type="number"
          min="0"
          value={offset}
          onChange={(e) => setOffset(Math.max(0, Number(e.target.value)))}
        />
      </div>
      {loading ? <p>Загрузка…</p> : null}
      {!loading && !events.length ? <p className="admin-empty">Нет событий.</p> : null}
      <div className="admin-filters">
        <AdminPagination
          total={total}
          pageSize={Number(filters.limit || '10')}
          page={Math.max(1, Math.floor(offset / Number(filters.limit || '10')) + 1)}
          onChange={(nextPage) => setOffset((nextPage - 1) * Number(filters.limit || '10'))}
          className="admin-pagination_compact"
          label={loading ? 'Загрузка…' : undefined}
        />
      </div>
      <AdminSection title="События аудита">
        <AdminTable headers={['Время', 'Пользователь', 'Сущность', 'Действие', 'Детали']}>
          {!loading && !events.length ? <div className="admin-empty">Нет событий.</div> : null}
          {events.map((event) => (
            <div key={event.id} className="admin-audit-row admin-table__row">
              <div>{new Date(event.createdAt).toLocaleString()}</div>
              <div>
                {event.actor ? `${event.actor.fullName} (${event.actor.email})` : 'Система'}
              </div>
              <div>
                {event.entity} #{event.entityId}
              </div>
              <div>{event.action}</div>
              <div className="admin-audit-json">
                {event.before ? (
                  <details>
                    <summary>Before</summary>
                    <pre>{JSON.stringify(event.before, null, 2)}</pre>
                  </details>
                ) : null}
                {event.after ? (
                  <details>
                    <summary>After</summary>
                    <pre>{JSON.stringify(event.after, null, 2)}</pre>
                  </details>
                ) : null}
                {event.meta ? (
                  <details>
                    <summary>Meta</summary>
                    <pre>{JSON.stringify(event.meta, null, 2)}</pre>
                  </details>
                ) : null}
              </div>
            </div>
          ))}
        </AdminTable>
      </AdminSection>
    </AdminShell>
  );
};
