import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  adminListCatalog,
  adminUpsertCatalogItem,
  adminDeleteCatalogItem,
} from '../api/catalog';
import {
  adminListMaterials,
  adminCreateMaterial,
  adminUpdateMaterial,
  adminDeleteMaterial,
} from '../api/materials';
import {
  adminListStyles,
  adminCreateStyle,
  adminUpdateStyle,
  adminDeleteStyle,
} from '../api/styles';
import {
  adminListServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from '../api/services';
import { adminSearchUsers } from '../api/users';
import type {
  CatalogItem,
  FrameMaterial,
  FrameStyle,
  ServiceItem,
  UserProfile,
} from '../api/types';
import { Button } from '../components/ui-kit/Button';
import { useToast } from '../state/ToastContext';
import { useAuth } from '../state/AuthContext';
import { can } from '../state/permissions';
import { AdminInput, AdminTextarea } from '../components/admin/AdminField';
import { AdminPagination } from '../components/admin/AdminPagination';
import { AdminShell } from '../components/admin/AdminShell';
import { AdminSection } from '../components/admin/AdminSection';
import { AdminTable } from '../components/admin/AdminTable';
import './AdminData.css';

type CatalogDraft = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  color?: string;
  materialId?: number;
  styleId?: string | null;
  widthCm?: number;
  heightCm?: number;
  imageUrl?: string;
  imageAlt?: string;
  type?: CatalogItem['type'];
};

type MaterialDraft = {
  id?: number;
  title?: string;
  material?: string;
  description?: string;
  pricePerCm?: number;
  imageUrl?: string;
  imageAlt?: string;
};

type StyleDraft = { id?: string; name?: string; coefficient?: number };
type ServiceDraft = {
  id?: number;
  type?: string;
  title?: string;
  price?: number;
};

export const AdminDataPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const role = user?.role ?? null;

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [materials, setMaterials] = useState<FrameMaterial[]>([]);
  const [styles, setStyles] = useState<FrameStyle[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [catalogDraft, setCatalogDraft] = useState<CatalogDraft>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    color: '',
    materialId: undefined,
    styleId: '',
    type: 'default',
    widthCm: 0,
    heightCm: 0,
    imageUrl: '',
    imageAlt: '',
  });
  const [materialDraft, setMaterialDraft] = useState<MaterialDraft>({});
  const [styleDraft, setStyleDraft] = useState<StyleDraft>({});
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>({});
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogPage, setCatalogPage] = useState(1);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialPage, setMaterialPage] = useState(1);
  const [styleSearch, setStyleSearch] = useState('');
  const [stylePage, setStylePage] = useState(1);
  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const PAGE_SIZE = 10;
  const TABS = [
    { id: 'catalog', label: 'Каталог' },
    { id: 'materials', label: 'Материалы' },
    { id: 'styles', label: 'Стили' },
    { id: 'services', label: 'Услуги' },
    { id: 'users', label: 'Пользователи' },
  ] as const;
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]['id']>('catalog');

  const canManage = useMemo(() => can(role, 'catalog:manage'), [role]);
  const materialOptions = useMemo(
    () =>
      materials.map((m) => ({
        value: m.id,
        label: m.title || `Материал #${m.id}`,
      })),
    [materials]
  );
  const styleOptions = useMemo(
    () => styles.map((s) => ({ value: s.id, label: s.name || s.id })),
    [styles]
  );
  const formatRole = (value: string) =>
    value === 'ADMIN' ? 'Администратор' : 'Покупатель';

  const onCatalogInput =
    (key: keyof CatalogDraft, parser?: (v: string) => unknown) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCatalogDraft((p) => ({
        ...p,
        [key]: parser ? parser(e.target.value) : e.target.value,
      }));

  const onMaterialInput =
    (key: keyof MaterialDraft, parser?: (v: string) => unknown) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setMaterialDraft((p) => ({
        ...p,
        [key]: parser ? parser(e.target.value) : e.target.value,
      }));

  const onStyleInput =
    (key: keyof StyleDraft, parser?: (v: string) => unknown) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setStyleDraft((p) => ({
        ...p,
        [key]: parser ? parser(e.target.value) : e.target.value,
      }));

  const onServiceInput =
    (key: keyof ServiceDraft, parser?: (v: string) => unknown) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setServiceDraft((p) => ({
        ...p,
        [key]: parser ? parser(e.target.value) : e.target.value,
      }));

  useEffect(() => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    void Promise.all([
      adminListCatalog().then(setCatalog),
      adminListMaterials().then(setMaterials),
      adminListStyles().then(setStyles),
      adminListServices().then(setServices),
      adminSearchUsers({}).then(setUsers),
    ])
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить данные');
        addToast({ type: 'error', message: 'Не удалось загрузить данные' });
      })
      .finally(() => setLoading(false));
  }, [canManage, addToast]);

  const handleCatalogSave = async () => {
    if (!catalogDraft.title?.trim() || !catalogDraft.slug?.trim()) {
      addToast({ type: 'error', message: 'Укажите название и slug' });
      return;
    }
    try {
      const saved = await adminUpsertCatalogItem({
        ...catalogDraft,
        materialId: catalogDraft.materialId,
        styleId: catalogDraft.styleId ?? null,
        widthCm: catalogDraft.widthCm,
        heightCm: catalogDraft.heightCm,
        description: catalogDraft.description ?? '',
        imageUrl: catalogDraft.imageUrl ?? '',
        imageAlt: catalogDraft.imageAlt ?? '',
        type: catalogDraft.type ?? 'default',
      });
      setCatalog((prev) => {
        const exists = prev.find((c) => c.id === saved.id);
        if (exists) {
          return prev.map((c) => (c.id === saved.id ? saved : c));
        }
        return [saved, ...prev];
      });
      addToast({ type: 'success', message: 'Каталог сохранён' });
      setCatalogDraft({
        title: '',
        slug: '',
        description: '',
        price: 0,
        stock: 0,
        color: '',
        materialId: undefined,
        styleId: '',
        type: 'default',
        widthCm: 0,
        heightCm: 0,
        imageUrl: '',
        imageAlt: '',
      });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Не удалось сохранить позицию' });
    }
  };

  const handleMaterialSave = async () => {
    try {
      const payload = {
        title: materialDraft.title,
        material: materialDraft.material,
        description: materialDraft.description,
        pricePerCm: materialDraft.pricePerCm,
        imageUrl: materialDraft.imageUrl,
        imageAlt: materialDraft.imageAlt,
      };
      if (materialDraft.id) {
        const updated = await adminUpdateMaterial(
          Number(materialDraft.id),
          payload
        );
        setMaterials((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      } else {
        const created = await adminCreateMaterial(payload);
        setMaterials((prev) => [created, ...prev]);
      }
      addToast({ type: 'success', message: 'Материал сохранён' });
      setMaterialDraft({});
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Не удалось сохранить материал' });
    }
  };

  const handleStyleSave = async () => {
    try {
      if (styleDraft.id) {
        const updated = await adminUpdateStyle(
          String(styleDraft.id),
          styleDraft
        );
        setStyles((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        const created = await adminCreateStyle(styleDraft);
        setStyles((prev) => [created, ...prev]);
      }
      addToast({ type: 'success', message: 'Стиль сохранён' });
      setStyleDraft({});
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Не удалось сохранить стиль' });
    }
  };

  const handleServiceSave = async () => {
    try {
      const id = serviceDraft.id ? Number(serviceDraft.id) : null;
      if (!id || Number.isNaN(id)) {
        addToast({ type: 'error', message: 'Укажите числовой ID услуги' });
        return;
      }
      if (!serviceDraft.type?.trim() || !serviceDraft.title?.trim()) {
        addToast({ type: 'error', message: 'Укажите тип и название услуги' });
        return;
      }

      const existing = services.find(
        (s) => s.id === id || s.type === serviceDraft.type
      );
      const payload = {
        id,
        type: serviceDraft.type,
        title: serviceDraft.title,
        price: serviceDraft.price ?? 0,
      };

      if (existing) {
        const updated = await adminUpdateService(existing.id, {
          type: payload.type,
          title: payload.title,
          price: payload.price,
        });
        setServices((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        const created = await adminCreateService(payload);
        setServices((prev) => [created, ...prev]);
      }
      addToast({ type: 'success', message: 'Услуга сохранена' });
      setServiceDraft({});
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Не удалось сохранить услугу' });
    }
  };

  const handleUsersSearch = async () => {
    try {
      const list = await adminSearchUsers({
        search: userSearch || undefined,
        role: userRoleFilter || undefined,
      });
      setUsers(list);
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        message: 'Не удалось загрузить пользователей',
      });
    }
  };

  if (!canManage) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-card__title">
            Нет прав для управления каталогом
          </h2>
          <p className="auth-card__subtitle">Обратитесь к администратору.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell title="Данные" active="data">
      {loading ? <p>Загрузка данных…</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab${
              activeTab === tab.id ? ' admin-tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'catalog' ? (
        <AdminSection title="Каталог">
          <div className="admin-grid">
            <AdminInput
              label="Поиск"
              value={catalogSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCatalogSearch(e.target.value);
                setCatalogPage(1);
              }}
            />
            <AdminInput
              label="ID (опционально для обновления)"
              value={catalogDraft.id ?? ''}
              onChange={onCatalogInput('id')}
            />
            <AdminInput
              label="Название"
              value={catalogDraft.title ?? ''}
              onChange={onCatalogInput('title')}
            />
            <AdminInput
              label="Slug"
              value={catalogDraft.slug ?? ''}
              onChange={onCatalogInput('slug')}
            />
            <AdminInput
              label="Цена"
              type="number"
              value={catalogDraft.price ?? 0}
              onChange={onCatalogInput('price', (v) => Number(v))}
            />
            <AdminInput
              label="Остаток"
              type="number"
              value={catalogDraft.stock ?? 0}
              onChange={onCatalogInput('stock', (v) => Number(v))}
            />
            <label>
              Материал
              <select
                className="auth-input"
                value={catalogDraft.materialId ?? ''}
                onChange={(e) =>
                  setCatalogDraft((prev) => ({
                    ...prev,
                    materialId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              >
                <option value="">Выберите материал</option>
                {materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Стиль
              <select
                className="auth-input"
                value={catalogDraft.styleId ?? ''}
                onChange={(e) =>
                  setCatalogDraft((prev) => ({
                    ...prev,
                    styleId: e.target.value || null,
                  }))
                }
              >
                <option value="">Выберите стиль</option>
                {styleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <AdminInput
              label="Цвет"
              value={catalogDraft.color ?? ''}
              onChange={onCatalogInput('color')}
            />
            <AdminInput
              label="Ширина (см)"
              type="number"
              value={catalogDraft.widthCm ?? 0}
              onChange={onCatalogInput('widthCm', (v) => Number(v))}
            />
            <AdminInput
              label="Высота (см)"
              type="number"
              value={catalogDraft.heightCm ?? 0}
              onChange={onCatalogInput('heightCm', (v) => Number(v))}
            />
            <AdminInput
              label="URL изображения"
              value={catalogDraft.imageUrl ?? ''}
              onChange={onCatalogInput('imageUrl')}
            />
            <AdminInput
              label="Alt изображения"
              value={catalogDraft.imageAlt ?? ''}
              onChange={onCatalogInput('imageAlt')}
            />
            <AdminTextarea
              className="full"
              label="Описание"
              value={catalogDraft.description ?? ''}
              onChange={onCatalogInput('description')}
            />
          </div>
          <div className="admin-actions">
            <Button onClick={handleCatalogSave}>Сохранить</Button>
          </div>
          <div className="admin-pagination-row">
            <AdminPagination
              total={catalog.length}
              pageSize={PAGE_SIZE}
              page={catalogPage}
              onChange={(next) => setCatalogPage(next)}
            />
          </div>
          <AdminTable
            headers={[
              'ID',
              'Название',
              'Цена',
              'Остаток',
              'Материал',
              'Стиль',
              '',
            ]}
          >
            {!loading && !catalog.length ? (
              <div className="admin-empty">Нет позиций.</div>
            ) : null}
            {catalog
              .filter((item) =>
                catalogSearch
                  ? `${item.title} ${item.slug} ${item.color}`
                      .toLowerCase()
                      .includes(catalogSearch.toLowerCase())
                  : true
              )
              .slice((catalogPage - 1) * PAGE_SIZE, catalogPage * PAGE_SIZE)
              .map((item) => (
                <div key={item.id} className="admin-table__row">
                  <div>{item.id}</div>
                  <div>{item.title}</div>
                  <div>{item.price}</div>
                  <div>{item.stock}</div>
                  <div>{item.material?.title ?? item.material?.id ?? '—'}</div>
                  <div>{item.style?.name ?? item.style?.id ?? '—'}</div>
                  <div className="admin-table__actions">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setCatalogDraft({
                          id: item.id,
                          title: item.title,
                          slug: item.slug,
                          description: item.description ?? '',
                          price: item.price,
                          stock: item.stock,
                          color: item.color,
                          materialId: (
                            item.material as unknown as { id?: number }
                          )?.id,
                          styleId: item.style?.id ?? null,
                          widthCm: item.size.widthCm,
                          heightCm: item.size.heightCm,
                          imageUrl: item.image?.src,
                          imageAlt: item.image?.alt,
                          type: item.type,
                        })
                      }
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!confirm('Удалить позицию?')) return;
                        await adminDeleteCatalogItem(item.id);
                        setCatalog((prev) =>
                          prev.filter((c) => c.id !== item.id)
                        );
                        addToast({ type: 'success', message: 'Удалено' });
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
          </AdminTable>
        </AdminSection>
      ) : null}

      {activeTab === 'materials' ? (
        <AdminSection title="Материалы">
          <div className="admin-grid">
            <AdminInput
              label="Поиск"
              value={materialSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMaterialSearch(e.target.value);
                setMaterialPage(1);
              }}
            />
            <AdminInput
              label="ID (для обновления)"
              value={materialDraft.id ?? ''}
              onChange={onMaterialInput('id', (v) => Number(v) || undefined)}
            />
            <AdminInput
              label="Название"
              value={materialDraft.title ?? ''}
              onChange={onMaterialInput('title')}
            />
            <AdminInput
              label="Материал"
              value={materialDraft.material ?? ''}
              onChange={onMaterialInput('material')}
            />
            <AdminInput
              label="Цена за см"
              type="number"
              value={materialDraft.pricePerCm ?? 0}
              onChange={onMaterialInput('pricePerCm', (v) => Number(v))}
            />
            <AdminInput
              label="URL изображения"
              value={materialDraft.imageUrl ?? ''}
              onChange={onMaterialInput('imageUrl')}
            />
            <AdminInput
              label="Alt изображения"
              value={materialDraft.imageAlt ?? ''}
              onChange={onMaterialInput('imageAlt')}
            />
            <AdminTextarea
              className="full"
              label="Описание"
              value={materialDraft.description ?? ''}
              onChange={onMaterialInput('description')}
            />
          </div>
          <div className="admin-actions">
            <Button onClick={handleMaterialSave}>Сохранить</Button>
          </div>
          <div className="admin-pagination-row">
            <AdminPagination
              total={materials.length}
              pageSize={PAGE_SIZE}
              page={materialPage}
              onChange={(next) => setMaterialPage(next)}
            />
          </div>
          <AdminTable headers={['ID', 'Название', 'Цена за см', '']}>
            {!loading && !materials.length ? (
              <div className="admin-empty">Нет материалов.</div>
            ) : null}
            {materials
              .filter((m) =>
                materialSearch
                  ? `${m.title} ${m.material}`
                      .toLowerCase()
                      .includes(materialSearch.toLowerCase())
                  : true
              )
              .slice((materialPage - 1) * PAGE_SIZE, materialPage * PAGE_SIZE)
              .map((m) => (
                <div key={m.id} className="admin-table__row">
                  <div>{m.id}</div>
                  <div>{m.title}</div>
                  <div>{m.pricePerCm}</div>
                  <div className="admin-table__actions">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setMaterialDraft({
                          id: m.id,
                          title: m.title,
                          material: m.material,
                          description: m.description,
                          pricePerCm: m.pricePerCm,
                          imageUrl: m.image?.src,
                          imageAlt: m.image?.alt,
                        })
                      }
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!confirm('Удалить материал?')) return;
                        await adminDeleteMaterial(m.id);
                        setMaterials((prev) =>
                          prev.filter((x) => x.id !== m.id)
                        );
                        addToast({ type: 'success', message: 'Удалено' });
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
          </AdminTable>
        </AdminSection>
      ) : null}

      {activeTab === 'styles' ? (
        <AdminSection title="Стили">
          <div className="admin-grid">
            <AdminInput
              label="Поиск"
              value={styleSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setStyleSearch(e.target.value);
                setStylePage(1);
              }}
            />
            <AdminInput
              label="ID"
              value={styleDraft.id ?? ''}
              onChange={onStyleInput('id')}
            />
            <AdminInput
              label="Название"
              value={styleDraft.name ?? ''}
              onChange={onStyleInput('name')}
            />
            <AdminInput
              label="Коэффициент"
              type="number"
              value={styleDraft.coefficient ?? 1}
              onChange={onStyleInput('coefficient', (v) => Number(v))}
            />
          </div>
          <div className="admin-actions">
            <Button onClick={handleStyleSave}>Сохранить</Button>
          </div>
          <div className="admin-pagination-row">
            <AdminPagination
              total={styles.length}
              pageSize={PAGE_SIZE}
              page={stylePage}
              onChange={(next) => setStylePage(next)}
            />
          </div>
          <AdminTable headers={['ID', 'Название', 'Коэф.', '']}>
            {!loading && !styles.length ? (
              <div className="admin-empty">Нет стилей.</div>
            ) : null}
            {styles
              .filter((s) =>
                styleSearch
                  ? `${s.id} ${s.name}`
                      .toLowerCase()
                      .includes(styleSearch.toLowerCase())
                  : true
              )
              .slice((stylePage - 1) * PAGE_SIZE, stylePage * PAGE_SIZE)
              .map((s) => (
                <div key={s.id} className="admin-table__row">
                  <div>{s.id}</div>
                  <div>{s.name}</div>
                  <div>{s.coefficient}</div>
                  <div className="admin-table__actions">
                    <Button
                      variant="secondary"
                      onClick={() => setStyleDraft(s)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!confirm('Удалить стиль?')) return;
                        await adminDeleteStyle(s.id);
                        setStyles((prev) => prev.filter((x) => x.id !== s.id));
                        addToast({ type: 'success', message: 'Удалено' });
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
          </AdminTable>
        </AdminSection>
      ) : null}

      {activeTab === 'services' ? (
        <AdminSection title="Услуги">
          <div className="admin-grid">
            <AdminInput
              label="Поиск"
              value={serviceSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setServiceSearch(e.target.value);
                setServicePage(1);
              }}
            />
            <AdminInput
              label="ID"
              value={serviceDraft.id ?? ''}
              onChange={onServiceInput('id', (v) => Number(v) || undefined)}
            />
            <AdminInput
              label="Тип"
              value={serviceDraft.type ?? ''}
              onChange={onServiceInput('type')}
            />
            <AdminInput
              label="Название"
              value={serviceDraft.title ?? ''}
              onChange={onServiceInput('title')}
            />
            <AdminInput
              label="Цена"
              type="number"
              value={serviceDraft.price ?? 0}
              onChange={onServiceInput('price', (v) => Number(v))}
            />
          </div>
          <div className="admin-actions">
            <Button onClick={handleServiceSave}>Сохранить</Button>
          </div>
          <div className="admin-pagination-row">
            <AdminPagination
              total={services.length}
              pageSize={PAGE_SIZE}
              page={servicePage}
              onChange={(next) => setServicePage(next)}
            />
          </div>
          <AdminTable headers={['ID', 'Тип', 'Название', 'Цена', '']}>
            {!loading && !services.length ? (
              <div className="admin-empty">Нет услуг.</div>
            ) : null}
            {services
              .filter((s) =>
                serviceSearch
                  ? `${s.title} ${s.type}`
                      .toLowerCase()
                      .includes(serviceSearch.toLowerCase())
                  : true
              )
              .slice((servicePage - 1) * PAGE_SIZE, servicePage * PAGE_SIZE)
              .map((s) => (
                <div key={s.id} className="admin-table__row">
                  <div>{s.id}</div>
                  <div>{s.type}</div>
                  <div>{s.title}</div>
                  <div>{s.price}</div>
                  <div className="admin-table__actions">
                    <Button
                      variant="secondary"
                      onClick={() => setServiceDraft(s)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        if (!confirm('Удалить услугу?')) return;
                        await adminDeleteService(s.id);
                        setServices((prev) =>
                          prev.filter((x) => x.id !== s.id)
                        );
                        addToast({ type: 'success', message: 'Удалено' });
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
          </AdminTable>
        </AdminSection>
      ) : null}

      {activeTab === 'users' ? (
        <AdminSection title="Пользователи">
          <div className="admin-grid">
            <label>
              Поиск
              <input
                className="auth-input"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Email, ФИО, телефон"
              />
            </label>
            <label>
              Роль
              <select
                className="auth-input"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="">Любая</option>
                <option value="ADMIN">Администратор</option>
                <option value="CUSTOMER">Покупатель</option>
              </select>
            </label>
            <div className="admin-actions">
              <Button
                variant="secondary"
                onClick={() => void handleUsersSearch()}
              >
                Найти
              </Button>
            </div>
          </div>
          <div className="admin-filters">
            <AdminPagination
              total={users.length}
              pageSize={PAGE_SIZE}
              page={usersPage}
              onChange={(next) => setUsersPage(next)}
            />
          </div>
          <AdminTable headers={['ID', 'Email', 'Имя', 'Телефон', 'Роль']}>
            {!loading && !users.length ? (
              <div className="admin-empty">Нет пользователей по фильтру.</div>
            ) : null}
            {users
              .slice((usersPage - 1) * PAGE_SIZE, usersPage * PAGE_SIZE)
              .map((u) => (
                <div key={u.id} className="admin-table__row">
                  <div>{u.id}</div>
                  <div>{u.email}</div>
                  <div>{u.fullName}</div>
                  <div>{u.phone ?? '—'}</div>
                  <div>{formatRole(u.role)}</div>
                </div>
              ))}
          </AdminTable>
        </AdminSection>
      ) : null}
    </AdminShell>
  );
};
