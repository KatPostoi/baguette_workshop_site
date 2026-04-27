import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  adminDeleteCatalogItem,
  adminListCatalog,
  adminUpsertCatalogItem,
  type CatalogUpsertInput,
} from '../../../api/catalog';
import { adminListMaterials } from '../../../api/materials';
import { adminListStyles } from '../../../api/styles';
import type { CatalogItem, FrameMaterial, FrameStyle } from '../../../api/types';
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
import { AdminInput, AdminSelect, AdminTextarea } from '../AdminField';
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

type CatalogDraft = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  color: string;
  materialId: string;
  styleId: string;
  widthCm: number;
  heightCm: number;
  imageUrl: string;
  imageAlt: string;
};

type DialogMode = 'create' | 'edit' | null;
type CatalogFilterState = {
  id: string;
  title: string;
  price: string;
  stock: string;
  material: string;
  style: string;
};

const createCatalogFilters = (): CatalogFilterState => ({
  id: '',
  title: '',
  price: '',
  stock: '',
  material: '',
  style: '',
});

const createEmptyDraft = (): CatalogDraft => ({
  id: '',
  title: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  color: '',
  materialId: '',
  styleId: '',
  widthCm: 0,
  heightCm: 0,
  imageUrl: '',
  imageAlt: '',
});

const mapCatalogItemToDraft = (item: CatalogItem): CatalogDraft => ({
  id: item.id,
  title: item.title,
  slug: item.slug,
  description: item.description ?? '',
  price: item.price,
  stock: item.stock,
  color: item.color,
  materialId: String(item.material.id),
  styleId: item.style?.id ?? '',
  widthCm: item.size.widthCm,
  heightCm: item.size.heightCm,
  imageUrl: item.image.src,
  imageAlt: item.image.alt,
});

const buildCatalogPayload = (draft: CatalogDraft): CatalogUpsertInput => ({
  title: draft.title.trim(),
  slug: draft.slug.trim(),
  description: draft.description.trim(),
  price: draft.price,
  stock: draft.stock,
  color: draft.color.trim(),
  materialId: Number(draft.materialId),
  styleId: draft.styleId || null,
  widthCm: draft.widthCm,
  heightCm: draft.heightCm,
  imageUrl: draft.imageUrl.trim(),
  imageAlt: draft.imageAlt.trim(),
  type: 'default',
});

const validateCatalogDraft = (draft: CatalogDraft) => {
  if (!draft.title.trim() || !draft.slug.trim()) {
    return 'Укажите название и slug.';
  }

  if (!draft.description.trim() || !draft.color.trim()) {
    return 'Заполните описание и цвет.';
  }

  if (!draft.materialId) {
    return 'Выберите материал.';
  }

  if (!draft.imageUrl.trim() || !draft.imageAlt.trim()) {
    return 'Заполните URL и alt изображения.';
  }

  if (draft.widthCm <= 0 || draft.heightCm <= 0) {
    return 'Размеры должны быть больше нуля.';
  }

  if (draft.price <= 0) {
    return 'Цена должна быть больше нуля.';
  }

  if (draft.stock < 0) {
    return 'Остаток не может быть отрицательным.';
  }

  return null;
};

export const AdminCatalogTab = () => {
  const { addToast } = useToast();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [materials, setMaterials] = useState<FrameMaterial[]>([]);
  const [styles, setStyles] = useState<FrameStyle[]>([]);
  const [filters, setFilters] = useState<CatalogFilterState>(createCatalogFilters);
  const [appliedFilters, setAppliedFilters] = useState<CatalogFilterState>(
    createCatalogFilters,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [draft, setDraft] = useState<CatalogDraft>(createEmptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<CatalogItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [catalogItems, materialItems, styleItems] = await Promise.all([
        adminListCatalog(),
        adminListMaterials(),
        adminListStyles(),
      ]);

      setCatalog(catalogItems);
      setMaterials(materialItems);
      setStyles(styleItems);
    } catch (loadError) {
      console.error(loadError);
      setError(
        getAdminErrorMessage(
          loadError,
          'Не удалось загрузить каталог и связанные справочники.',
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const titleOptions = useMemo(
    () => buildAdminSelectOptions(catalog, (item) => item.title),
    [catalog],
  );
  const priceOptions = useMemo(
    () => buildAdminSelectOptions(catalog, (item) => item.price),
    [catalog],
  );
  const stockOptions = useMemo(
    () => buildAdminSelectOptions(catalog, (item) => item.stock),
    [catalog],
  );
  const materialOptions = useMemo(
    () => buildAdminSelectOptions(catalog, (item) => item.material?.title),
    [catalog],
  );
  const styleOptions = useMemo(
    () =>
      buildAdminSelectOptions(catalog, (item) => item.style?.name ?? 'Без стиля'),
    [catalog],
  );

  const filteredCatalog = useMemo(
    () =>
      catalog.filter(
        (item) =>
          matchesAdminSearch(appliedFilters.id, item.id) &&
          matchesAdminSelectValue(appliedFilters.title, item.title) &&
          matchesAdminSelectValue(appliedFilters.price, item.price) &&
          matchesAdminSelectValue(appliedFilters.stock, item.stock) &&
          matchesAdminSelectValue(
            appliedFilters.material,
            item.material?.title,
          ) &&
          matchesAdminSelectValue(
            appliedFilters.style,
            item.style?.name ?? 'Без стиля',
          ),
      ),
    [appliedFilters, catalog],
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredCatalog.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredCatalog.length, page]);

  const paginatedCatalog = useMemo(
    () =>
      filteredCatalog.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [filteredCatalog, page],
  );

  const updateDraft = <TKey extends keyof CatalogDraft>(
    key: TKey,
    value: CatalogDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const onDraftInput =
    (
      key: keyof CatalogDraft,
      parser?: (value: string) => CatalogDraft[keyof CatalogDraft],
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateDraft(key, parser ? parser(event.target.value) : event.target.value);
    };

  const openCreateDialog = () => {
    setDraft(createEmptyDraft());
    setDialogMode('create');
  };

  const openEditDialog = (item: CatalogItem) => {
    setDraft(mapCatalogItemToDraft(item));
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
    const validationError = validateCatalogDraft(draft);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      const payload = buildCatalogPayload(draft);
      const saved = await adminUpsertCatalogItem(
        dialogMode === 'edit' ? { ...payload, id: draft.id } : payload,
      );

      setCatalog((current) => {
        const exists = current.some((item) => item.id === saved.id);
        const next = exists
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current];

        return next;
      });

      setPage(1);
      setDialogMode(null);
      setDraft(createEmptyDraft());
      addToast({
        type: 'success',
        message:
          dialogMode === 'edit'
            ? 'Позиция каталога обновлена.'
            : 'Позиция каталога создана.',
      });
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          saveError,
          'Не удалось сохранить позицию каталога.',
        ),
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
      await adminDeleteCatalogItem(deleteCandidate.id);
      setCatalog((current) =>
        current.filter((item) => item.id !== deleteCandidate.id),
      );
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Позиция каталога удалена.' });
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(
          deleteError,
          'Не удалось удалить позицию каталога.',
        ),
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
    const nextFilters = createCatalogFilters();
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
        <AdminSelect
          label="Остаток"
          value={filters.stock}
          onChange={(event) =>
            setFilters((current) => ({ ...current, stock: event.target.value }))
          }
        >
          <option value="">Все остатки</option>
          {stockOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Материал"
          value={filters.material}
          onChange={(event) =>
            setFilters((current) => ({ ...current, material: event.target.value }))
          }
        >
          <option value="">Все материалы</option>
          {materialOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          label="Стиль"
          value={filters.style}
          onChange={(event) =>
            setFilters((current) => ({ ...current, style: event.target.value }))
          }
        >
          <option value="">Все стили</option>
          {styleOptions.map((option) => (
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
            total={filteredCatalog.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
          />
        }
        actions={
          <AdminPaginationControls
            total={filteredCatalog.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!filteredCatalog.length}
          loadingMessage="Загружаем каталог…"
          emptyMessage="Нет позиций каталога."
        >
          <AdminTable
            headers={[
              'ID',
              'Название',
              'Цена',
              'Остаток',
              'Материал',
              'Стиль',
              'Действия',
            ]}
            className="admin-catalog-table"
          >
            {paginatedCatalog.map((item) => (
              <div key={item.id} className="admin-table__row">
                <div>{item.id}</div>
                <div>{item.title}</div>
                <div>{item.price}</div>
                <div>{item.stock}</div>
                <div>{item.material?.title ?? '—'}</div>
                <div>{item.style?.name ?? 'Без стиля'}</div>
                <AdminRowActions className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(item)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteCandidate(item)}
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
        title={dialogMode === 'edit' ? 'Редактировать позицию каталога' : 'Новая позиция каталога'}
        description={
          dialogMode === 'edit'
            ? 'Изменяется существующая карточка каталога. Внутренний ID остаётся неизменяемым.'
            : 'Новая позиция попадёт в общий каталог после успешного сохранения.'
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать позицию'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        {dialogMode === 'edit' ? (
          <div className="admin-dialog__meta">
            <span className="admin-dialog__meta-label">Внутренний ID</span>
            <span className="admin-dialog__meta-value">{draft.id}</span>
          </div>
        ) : null}

        <div className="admin-dialog__form-grid">
          <AdminInput label="Название" value={draft.title} onChange={onDraftInput('title')} />
          <AdminInput label="Slug" value={draft.slug} onChange={onDraftInput('slug')} />
          <AdminInput
            label="Цена"
            type="number"
            value={draft.price}
            onChange={onDraftInput('price', (value) => Number(value))}
          />
          <AdminInput
            label="Остаток"
            type="number"
            value={draft.stock}
            onChange={onDraftInput('stock', (value) => Number(value))}
          />
          <AdminSelect
            label="Материал"
            value={draft.materialId}
            onChange={(event) => updateDraft('materialId', event.target.value)}
          >
            <option value="">Выберите материал</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.title}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect
            label="Стиль"
            value={draft.styleId}
            onChange={(event) => updateDraft('styleId', event.target.value)}
          >
            <option value="">Без стиля</option>
            {styles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </AdminSelect>
          <AdminInput label="Цвет" value={draft.color} onChange={onDraftInput('color')} />
          <AdminInput
            label="Ширина (см)"
            type="number"
            value={draft.widthCm}
            onChange={onDraftInput('widthCm', (value) => Number(value))}
          />
          <AdminInput
            label="Высота (см)"
            type="number"
            value={draft.heightCm}
            onChange={onDraftInput('heightCm', (value) => Number(value))}
          />
          <AdminInput
            label="URL изображения"
            value={draft.imageUrl}
            onChange={onDraftInput('imageUrl')}
          />
          <AdminInput
            label="Alt изображения"
            value={draft.imageAlt}
            onChange={onDraftInput('imageAlt')}
          />
          <AdminTextarea
            className="admin-field--full"
            label="Описание"
            value={draft.description}
            onChange={onDraftInput('description')}
          />
        </div>
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        title="Удалить позицию каталога?"
        description={
          deleteCandidate
            ? `Позиция «${deleteCandidate.title}» будет удалена из каталога без возможности восстановления.`
            : ''
        }
        confirmLabel="Удалить позицию"
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
