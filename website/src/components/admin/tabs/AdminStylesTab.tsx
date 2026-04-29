import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  adminCreateStyle,
  adminDeleteStyle,
  adminListStyles,
  adminUpdateStyle,
  type AdminStyleInput,
} from '../../../api/styles';
import type { FrameStyle } from '../../../api/types';
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

type StyleDraft = AdminStyleInput;
type DialogMode = 'create' | 'edit' | null;
type StyleFilterState = {
  id: string;
  name: string;
};

const createStyleFilters = (): StyleFilterState => ({
  id: '',
  name: '',
});

const createEmptyDraft = (): StyleDraft => ({
  id: '',
  name: '',
  coefficient: 1,
});

const validateStyleDraft = (draft: StyleDraft) => {
  if (!draft.id.trim()) {
    return 'Укажите строковый ID стиля.';
  }

  if (!draft.name.trim()) {
    return 'Укажите название стиля.';
  }

  if (draft.coefficient <= 0) {
    return 'Коэффициент должен быть больше нуля.';
  }

  return null;
};

export const AdminStylesTab = () => {
  const { addToast } = useToast();
  const [styles, setStyles] = useState<FrameStyle[]>([]);
  const [filters, setFilters] = useState<StyleFilterState>(createStyleFilters);
  const [appliedFilters, setAppliedFilters] = useState<StyleFilterState>(
    createStyleFilters,
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [draft, setDraft] = useState<StyleDraft>(createEmptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<FrameStyle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadStyles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setStyles(await adminListStyles());
    } catch (loadError) {
      console.error(loadError);
      setError(getAdminErrorMessage(loadError, 'Не удалось загрузить стили.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStyles();
  }, [loadStyles]);

  const nameOptions = useMemo(
    () => buildAdminSelectOptions(styles, (style) => style.name),
    [styles],
  );

  const filteredStyles = useMemo(
    () =>
      styles.filter(
        (style) =>
          matchesAdminSearch(appliedFilters.id, style.id) &&
          matchesAdminSelectValue(appliedFilters.name, style.name),
      ),
    [appliedFilters, styles],
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredStyles.length / DEFAULT_ADMIN_PAGE_SIZE),
    );

    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredStyles.length, page]);

  const paginatedStyles = useMemo(
    () =>
      filteredStyles.slice(
        (page - 1) * DEFAULT_ADMIN_PAGE_SIZE,
        page * DEFAULT_ADMIN_PAGE_SIZE,
      ),
    [filteredStyles, page],
  );

  const updateDraft = <TKey extends keyof StyleDraft>(
    key: TKey,
    value: StyleDraft[TKey],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const onDraftInput =
    (
      key: keyof StyleDraft,
      parser?: (value: string) => StyleDraft[keyof StyleDraft],
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateDraft(key, parser ? parser(event.target.value) : event.target.value);
    };

  const openCreateDialog = () => {
    setDraft(createEmptyDraft());
    setDialogMode('create');
  };

  const openEditDialog = (style: FrameStyle) => {
    setDraft({
      id: style.id,
      name: style.name,
      coefficient: style.coefficient,
    });
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
    const validationError = validateStyleDraft(draft);

    if (validationError) {
      addToast({ type: 'error', message: validationError });
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'edit') {
        const updated = await adminUpdateStyle(draft.id, {
          name: draft.name.trim(),
          coefficient: draft.coefficient,
        });
        setStyles((current) =>
          current.map((style) => (style.id === updated.id ? updated : style)),
        );
      } else {
        const created = await adminCreateStyle({
          id: draft.id.trim(),
          name: draft.name.trim(),
          coefficient: draft.coefficient,
        });
        setStyles((current) => [created, ...current]);
        setPage(1);
      }

      setDialogMode(null);
      setDraft(createEmptyDraft());
      addToast({
        type: 'success',
        message: dialogMode === 'edit' ? 'Стиль обновлён.' : 'Стиль создан.',
      });
    } catch (saveError) {
      console.error(saveError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(saveError, 'Не удалось сохранить стиль.'),
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
      await adminDeleteStyle(deleteCandidate.id);
      setStyles((current) =>
        current.filter((style) => style.id !== deleteCandidate.id),
      );
      setDeleteCandidate(null);
      addToast({ type: 'success', message: 'Стиль удалён.' });
    } catch (deleteError) {
      console.error(deleteError);
      addToast({
        type: 'error',
        message: getAdminErrorMessage(deleteError, 'Не удалось удалить стиль.'),
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
    const nextFilters = createStyleFilters();
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
          value={filters.name}
          onChange={(event) =>
            setFilters((current) => ({ ...current, name: event.target.value }))
          }
        >
          <option value="">Все названия</option>
          {nameOptions.map((option) => (
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
            total={filteredStyles.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
          />
        }
        actions={
          <AdminPaginationControls
            total={filteredStyles.length}
            page={page}
            pageSize={DEFAULT_ADMIN_PAGE_SIZE}
            onChange={setPage}
          />
        }
      >
        <AdminListState
          loading={loading}
          error={error}
          isEmpty={!filteredStyles.length}
          loadingMessage="Загружаем стили…"
          emptyMessage="Нет стилей."
        >
          <AdminTable
            headers={['ID', 'Название', 'Коэф.', 'Действия']}
            className="admin-styles-table"
          >
            {paginatedStyles.map((style) => (
              <div key={style.id} className="admin-table__row">
                <div>{style.id}</div>
                <div>{style.name}</div>
                <div>{style.coefficient}</div>
                <AdminRowActions className="admin-table__actions">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(style)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setDeleteCandidate(style)}
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
        title={dialogMode === 'edit' ? 'Редактировать стиль' : 'Новый стиль'}
        submitLabel={dialogMode === 'edit' ? 'Сохранить изменения' : 'Создать стиль'}
        onClose={closeDialog}
        onSubmit={() => void handleSave()}
        submitLoading={saving}
      >
        <div className="admin-dialog__form-grid">
          {dialogMode === 'create' ? (
            <AdminInput
              label="Строковый ID"
              value={draft.id}
              onChange={onDraftInput('id')}
            />
          ) : null}
          <AdminInput label="Название" value={draft.name} onChange={onDraftInput('name')} />
          <AdminInput
            label="Коэффициент"
            type="number"
            value={draft.coefficient}
            onChange={onDraftInput('coefficient', (value) => Number(value))}
          />
        </div>
      </AdminEntityDialog>

      <AdminConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        title="Удалить стиль?"
        description={
          deleteCandidate
            ? `Стиль «${deleteCandidate.name}» (${deleteCandidate.id}) будет удалён из справочника.`
            : ''
        }
        confirmLabel="Удалить стиль"
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
