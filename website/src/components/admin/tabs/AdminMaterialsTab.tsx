import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  adminCreateMaterial,
  adminDeleteMaterial,
  adminListMaterials,
  adminUpdateMaterial,
  type AdminMaterialInput,
} from '../../../api/materials';
import type { FrameMaterial } from '../../../api/types';
import {
  DEFAULT_ADMIN_PAGE_SIZE,
  getAdminErrorMessage,
  matchesAdminSearch,
} from '../adminCrudUtils';
import { useToast } from '../../../state/ToastContext';
import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminInput, AdminTextarea } from '../AdminField';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';
import { AdminPagination } from '../AdminPagination';
import { AdminRowActions } from '../AdminRowActions';
import { AdminTable } from '../AdminTable';
import { AdminEntityDialog } from '../forms/AdminEntityDialog';
import { AdminConfirmDialog } from '../forms/AdminConfirmDialog';
import { Button } from '../../ui-kit/Button';

type MaterialDraft = {
  id: number | null;
  title: string;
  material: string;
  description: string;
  pricePerCm: number;
  imageUrl: string;
  imageAlt: string;
};

type DialogMode = 'create' | 'edit' | null;

const createEmptyDraft = (): MaterialDraft => ({
  id: null,
  title: '',
  material: '',
  description: '',
  pricePerCm: 0,
  imageUrl: '',
  imageAlt: '',
});

const mapMaterialToDraft = (material: FrameMaterial): MaterialDraft => ({
  id: material.id,
  title: material.title,
  material: material.material,
  description: material.description,
  pricePerCm: material.pricePerCm,
  imageUrl: material.image.src,
  imageAlt: material.image.alt,
});

const buildMaterialPayload = (draft: MaterialDraft): AdminMaterialInput => ({
  title: draft.title.trim(),
  material: draft.material.trim(),
  description: draft.description.trim(),
  pricePerCm: draft.pricePerCm,
  imageUrl: draft.imageUrl.trim(),
  imageAlt: draft.imageAlt.trim(),
});

const validateMaterialDraft = (draft: MaterialDraft) => {
  if (!draft.title.trim() || !draft.material.trim()) {
    return 'Укажите название и тип материала.';
  }

  if (!draft.description.trim()) {
    return 'Заполните описание.';
  }

  if (draft.pricePerCm <= 0) {
    return 'Цена за сантиметр должна быть больше нуля.';
  }

  if (!draft.imageUrl.trim() || !draft.imageAlt.trim()) {
    return 'Заполните URL и alt изображения.';
  }

  return null;
};

export const AdminMaterialsTab = () => {
  const { addToast } = useToast();
  const [materials, setMaterials] = useState<FrameMaterial[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [draft, setDraft] = useState<MaterialDraft>(createEmptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<FrameMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setMaterials(await adminListMaterials());
    } catch (loadError) {
      console.error(loadError);
      setError(
        getAdminErrorMessage(loadError, 'Не удалось загрузить материалы.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) =>
        matchesAdminSearch(
          search,
          material.id,
          material.title,
          material.material,
          material.description,
        ),
      ),
    [materials, search],
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredMaterials.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredMaterials.length, page]);

  const paginatedMaterials = useMemo(
    () =>
      filteredMaterials.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [filteredMaterials, page],
  );

  const updateDraft = <TKey extends keyof MaterialDraft>(
    key: TKey,
    value: MaterialDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const onDraftInput =
    (
      key: keyof MaterialDraft,
      parser?: (value: string) => MaterialDraft[keyof MaterialDraft],
    ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateDraft(key, parser ? parser(event.target.value) : event.target.value);
    };

  const openCreateDialog = () => {
    setDraft(createEmptyDraft());
    setDialogMode('create');
  };

  const openEditDialog = (material: FrameMaterial) => {
    setDraft(mapMaterialToDraft(material));
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
    const validationError = validateMaterialDraft(draft);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      const payload = buildMaterialPayload(draft);

      if (dialogMode === 'edit' && draft.id) {
        const updated = await adminUpdateMaterial(draft.id, payload);
        setMaterials((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const created = await adminCreateMaterial(payload);
        setMaterials((current) => [created, ...current]);
        setPage(1);
      }

      setDialogMode(null);
      setDraft(createEmptyDraft());
      addToast({
        type: 'success',
        message:
          dialogMode === 'edit' ? 'Материал обновлён.' : 'Материал создан.',
      });
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(saveError, 'Не удалось сохранить материал.'),
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
      await adminDeleteMaterial(deleteCandidate.id);
      setMaterials((current) =>
        current.filter((item) => item.id !== deleteCandidate.id),
      );
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Материал удалён.' });
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(deleteError, 'Не удалось удалить материал.'),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminFilterPanel
        actions={
          <>
            <Button variant="secondary" onClick={() => void loadMaterials()} disabled={loading}>
              Обновить
            </Button>
            <Button onClick={openCreateDialog}>Новый материал</Button>
          </>
        }
      >
        <AdminInput
          label="Поиск"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="ID, название, тип, описание"
          helper="Материалы редактируются в отдельном dialog. На странице остаются только поиск, список и действия."
        />
      </AdminFilterPanel>

      <AdminListBlock
        title="Материалы"
        description="Материалы выровнены под тот же CRUD-паттерн, что и каталог: модальный edit flow, общий confirm delete и чистый list block."
        actions={
          <AdminPagination
            total={filteredMaterials.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!filteredMaterials.length}
          loadingMessage="Загружаем материалы…"
          emptyMessage="Нет материалов."
        >
          <AdminTable headers={['ID', 'Название', 'Цена за см', 'Действия']}>
            {paginatedMaterials.map((material) => (
              <div key={material.id} className="admin-table__row">
                <div>{material.id}</div>
                <div>{material.title}</div>
                <div>{material.pricePerCm}</div>
                <AdminRowActions className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(material)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteCandidate(material)}
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
        title={dialogMode === 'edit' ? 'Редактировать материал' : 'Новый материал'}
        description={
          dialogMode === 'edit'
            ? 'ID материала генерируется базой данных и остаётся неизменяемым.'
            : 'Новый материал сразу попадёт в справочник после сохранения.'
        }
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать материал'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        {dialogMode === 'edit' && draft.id ? (
          <div className="admin-dialog__meta">
            <span className="admin-dialog__meta-label">ID материала</span>
            <span className="admin-dialog__meta-value">{draft.id}</span>
          </div>
        ) : null}

        <div className="admin-dialog__form-grid">
          <AdminInput label="Название" value={draft.title} onChange={onDraftInput('title')} />
          <AdminInput label="Материал" value={draft.material} onChange={onDraftInput('material')} />
          <AdminInput
            label="Цена за см"
            type="number"
            value={draft.pricePerCm}
            onChange={onDraftInput('pricePerCm', (value) => Number(value))}
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
        title="Удалить материал?"
        description={
          deleteCandidate
            ? `Материал «${deleteCandidate.title}» будет удалён из справочника.`
            : ''
        }
        confirmLabel="Удалить материал"
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
