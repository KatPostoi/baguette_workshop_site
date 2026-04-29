import { AdminInput, AdminSelect } from '../AdminField';
import type { UserRole } from '../../../api/types';

export type AdminUserDraft = {
  id: string | null;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  gender: string;
  role: UserRole;
  isActive: boolean;
};

export type AdminUserDialogMode = 'create' | 'edit';

type AdminUserEditFormProps = {
  mode: AdminUserDialogMode;
  draft: AdminUserDraft;
  onChange: <TKey extends keyof AdminUserDraft>(
    key: TKey,
    value: AdminUserDraft[TKey],
  ) => void;
  roleDisabled?: boolean;
  activityDisabled?: boolean;
};

export const AdminUserEditForm = ({
  mode,
  draft,
  onChange,
  roleDisabled = false,
  activityDisabled = false,
}: AdminUserEditFormProps) => {
  const isCreateMode = mode === 'create';

  return (
    <>
      {isCreateMode ? (
        <div className="admin-dialog__form-grid">
          <AdminInput
            label="Email"
            type="email"
            value={draft.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="admin@example.com"
          />
          <AdminInput
            label="Пароль"
            type="password"
            value={draft.password}
            onChange={(event) => onChange('password', event.target.value)}
            placeholder="Минимум 6 символов"
          />
        </div>
      ) : (
        <div className="admin-dialog__form-grid">
          <AdminInput label="Email" type="email" value={draft.email} readOnly />
        </div>
      )}

      <div className="admin-dialog__form-grid">
        <AdminInput
          label="ФИО"
          value={draft.fullName}
          onChange={(event) => onChange('fullName', event.target.value)}
        />
        <AdminInput
          label="Телефон"
          value={draft.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          placeholder="+7..."
        />
        <AdminSelect
          label="Пол"
          value={draft.gender}
          onChange={(event) => onChange('gender', event.target.value)}
        >
          <option value="">Не указан</option>
          <option value="M">Мужской</option>
          <option value="F">Женский</option>
        </AdminSelect>
        <AdminSelect
          label="Роль"
          value={draft.role}
          onChange={(event) => onChange('role', event.target.value as UserRole)}
          disabled={roleDisabled}
        >
          <option value="CUSTOMER">Покупатель</option>
          <option value="ADMIN">Администратор</option>
        </AdminSelect>
        <AdminSelect
          label="Статус"
          value={draft.isActive ? 'active' : 'inactive'}
          onChange={(event) => onChange('isActive', event.target.value === 'active')}
          disabled={activityDisabled}
        >
          <option value="active">Активен</option>
          <option value="inactive">Неактивен</option>
        </AdminSelect>
      </div>
    </>
  );
};
