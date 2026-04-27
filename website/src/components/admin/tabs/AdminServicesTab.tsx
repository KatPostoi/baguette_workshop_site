import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  adminCreateService,
  adminDeleteService,
  adminListServices,
  adminUpdateService,
  type AdminServiceInput,
} from '../../../api/services';
import type { ServiceItem } from '../../../api/types';
import {
  DEFAULT_ADMIN_PAGE_SIZE,
  buildAdminSelectOptions,
  getAdminErrorMessage,
  matchesAdminSearch,
  matchesAdminSelectValue,
} from '../adminCrudUtils';
import { useToast } from '../../../state/ToastContext';
import { AdminCreateButton } from '../AdminCreateButton';
import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';
import {
  AdminPaginationControls,
  AdminPaginationInfo,
} from '../AdminPagination';
import { AdminRowActions } from '../AdminRowActions';
import { AdminTable } from '../AdminTable';
import { AdminEntityDialog } from '../forms/AdminEntityDialog';
import { AdminConfirmDialog } from '../forms/AdminConfirmDialog';
import { Button } from '../../ui-kit/Button';

type ServiceDraft = AdminServiceInput;
type DialogMode = 'create' | 'edit' | null;
type ServiceFilterState = {
  id: string;
  type: string;
  title: string;
  price: string;
};

const createServiceFilters = (): ServiceFilterState => ({
  id: '',
  type: '',
  title: '',
  price: '',
});

const createEmptyDraft = (): ServiceDraft => ({
  id: 0,
  type: '',
  title: '',
  price: 0,
});

const mapServiceToDraft = (service: ServiceItem): ServiceDraft => ({
  id: service.id,
  type: service.type,
  title: service.title,
  price: service.price,
});

const validateServiceDraft = (draft: ServiceDraft, mode: DialogMode) => {
  if (mode === 'create' && (!draft.id || Number.isNaN(draft.id) || draft.id <= 0)) {
    return 'Укажите числовой ID услуги.';
  }

  if (!draft.type.trim() || !draft.title.trim()) {
    return 'Укажите тип и название услуги.';
  }

  if (draft.price < 0) {
    return 'Цена не может быть отрицательной.';
  }

  return null;
};

export const AdminServicesTab = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filters, setFilters] = useState<ServiceFilterState>(
    createServiceFilters,
  );
  const [appliedFilters, setAppliedFilters] = useState<ServiceFilterState>(
    createServiceFilters,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [draft, setDraft] = useState<ServiceDraft>(createEmptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setServices(await adminListServices());
    } catch (loadError) {
      console.error(loadError);
      setError(getAdminErrorMessage(loadError, 'Не удалось загрузить услуги.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const typeOptions = useMemo(
    () => buildAdminSelectOptions(services, (service) => service.type),
    [services],
  );
  const titleOptions = useMemo(
    () => buildAdminSelectOptions(services, (service) => service.title),
    [services],
  );
  const priceOptions = useMemo(
    () => buildAdminSelectOptions(services, (service) => service.price),
    [services],
  );

  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) =>
          matchesAdminSearch(appliedFilters.id, service.id) &&
          matchesAdminSelectValue(appliedFilters.type, service.type) &&
          matchesAdminSelectValue(appliedFilters.title, service.title) &&
          matchesAdminSelectValue(appliedFilters.price, service.price),
      ),
    [appliedFilters, services],
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredServices.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredServices.length, page]);

  const paginatedServices = useMemo(
    () =>
      filteredServices.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [filteredServices, page],
  );

  const updateDraft = <TKey extends keyof ServiceDraft>(
    key: TKey,
    value: ServiceDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const onDraftInput =
    (
      key: keyof ServiceDraft,
      parser?: (value: string) => ServiceDraft[keyof ServiceDraft],
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateDraft(key, parser ? parser(event.target.value) : event.target.value);
    };

  const openCreateDialog = () => {
    setDraft(createEmptyDraft());
    setDialogMode('create');
  };

  const openEditDialog = (service: ServiceItem) => {
    setDraft(mapServiceToDraft(service));
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogMode(null);
    setDraft(createEmptyDraft());
  };

  const handleSave = async () => {
    const validationError = validateServiceDraft(draft, dialogMode);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'edit') {
        const updated = await adminUpdateService(draft.id, {
          type: draft.type.trim(),
          title: draft.title.trim(),
          price: draft.price,
        });
        setServices((current) =>
          current.map((service) => (service.id === updated.id ? updated : service)),
        );
      } else {
        const created = await adminCreateService({
          id: draft.id,
          type: draft.type.trim(),
          title: draft.title.trim(),
          price: draft.price,
        });
        setServices((current) => [created, ...current]);
        setPage(1);
      }

      setDialogMode(null);
      setDraft(createEmptyDraft());
      addToast({
        type: 'success',
        message: dialogMode === 'edit' ? 'Услуга обновлена.' : 'Услуга создана.',
      });
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(saveError, 'Не удалось сохранить услугу.'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    setDeleting(true);

    try {
      await adminDeleteService(deleteCandidate.id);
      setServices((current) =>
        current.filter((service) => service.id !== deleteCandidate.id),
      );
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Услуга удалена.' });
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(deleteError, 'Не удалось удалить услугу.'),
      });
    } finally {
      setDeleting(false);
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const resetFilters = () => {
    const nextFilters = createServiceFilters();
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  };

  return (
    <>
      <AdminFilterPanel
        actions={
          <>
            <Button onClick={applyFilters} disabled={loading}>
              Применить
            </Button>
            <Button variant="secondary" onClick={resetFilters} disabled={loading}>
              Сбросить
            </Button>
          </>
        }
      >
        <AdminInput
          label="ID"
          value={filters.id}
          onChange={(event) =>
            setFilters((current) => ({ ...current, id: event.target.value }))
          }
          placeholder="ID"
        />
        <AdminSelect
          label="Тип"
          value={filters.type}
          onChange={(event) =>
            setFilters((current) => ({ ...current, type: event.target.value }))
          }
        >
          <option value="">Все типы</option>
          {typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Название"
          value={filters.title}
          onChange={(event) =>
            setFilters((current) => ({ ...current, title: event.target.value }))
          }
        >
          <option value="">Все названия</option>
          {titleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Цена"
          value={filters.price}
          onChange={(event) =>
            setFilters((current) => ({ ...current, price: event.target.value }))
          }
        >
          <option value="">Все цены</option>
          {priceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>
      </AdminFilterPanel>

      <AdminListBlock
        primaryAction={<AdminCreateButton onClick={openCreateDialog} />}
        centerContent={
          <AdminPaginationInfo
            total={filteredServices.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
          />
        }
        actions={
          <AdminPaginationControls
            total={filteredServices.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!filteredServices.length}
          loadingMessage="Загружаем услуги…"
          emptyMessage="Нет услуг."
        >
          <AdminTable
            headers={['ID', 'Тип', 'Название', 'Цена', 'Действия']}
            className="admin-services-table"
          >
            {paginatedServices.map((service) => (
              <div key={service.id} className="admin-table__row">
                <div>{service.id}</div>
                <div>{service.type}</div>
                <div>{service.title}</div>
                <div>{service.price}</div>
                <AdminRowActions className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(service)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteCandidate(service)}
                  >
                    Удалить
                  </Button>
                </AdminRowActions>
              </div>
            ))}
          </AdminTable>
        </AdminListState>
      </AdminListBlock>

      <AdminEntityDialog
        isOpen={dialogMode !== null}
        title={dialogMode === 'edit' ? 'Редактировать услугу' : 'Новая услуга'}
        description={
          dialogMode === 'edit'
            ? 'ID услуги фиксирован и в режиме редактирования не меняется.'
            : 'В текущей схеме ServiceItem не имеет autoincrement, поэтому числовой ID задаётся явно.'
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать услугу'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        {dialogMode === 'edit' ? (
          <div className="admin-dialog__meta">
            <span className="admin-dialog__meta-label">ID услуги</span>
            <span className="admin-dialog__meta-value">{draft.id}</span>
          </div>
        ) : null}

        <div className="admin-dialog__form-grid">
          {dialogMode === 'create' ? (
            <AdminInput
              label="ID"
              type="number"
              value={draft.id || ''}
              onChange={onDraftInput('id', (value) => Number(value))}
              helper="Обязателен только при создании."
            />
          ) : null}
          <AdminInput label="Тип" value={draft.type} onChange={onDraftInput('type')} />
          <AdminInput label="Название" value={draft.title} onChange={onDraftInput('title')} />
          <AdminInput
            label="Цена"
            type="number"
            value={draft.price}
            onChange={onDraftInput('price', (value) => Number(value))}
          />
        </div>
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        title="Удалить услугу?"
        description={
          deleteCandidate
            ? `Услуга «${deleteCandidate.title}» будет удалена из справочника.`
            : ''
        }
        confirmLabel="Удалить услугу"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleting) {
            setDeleteCandidate(null);
          }
        }}
      />
    </>
  );
};
