import { AdminInput, AdminSelect } from '../AdminField';
import type { UserRole } from '../../../api/types';

export type AdminUserDraft = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  role: UserRole;
  isActive: boolean;
};

type AdminUserEditFormProps = {
  draft: AdminUserDraft;
  onChange: <TKey extends keyof AdminUserDraft>(
    key: TKey,
    value: AdminUserDraft[TKey],
  ) => void;
  roleDisabled?: boolean;
  activityDisabled?: boolean;
};

export const AdminUserEditForm = ({
  draft,
  onChange,
  roleDisabled = false,
  activityDisabled = false,
}: AdminUserEditFormProps) => (
  <>
    <div className="admin-dialog__meta">
      <span className="admin-dialog__meta-label">Email</span>
      <span className="admin-dialog__meta-value">{draft.email}</span>
    </div>

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
        helper="Можно очистить поле, оставив его пустым."
      />
      <AdminInput
        label="Пол"
        value={draft.gender}
        onChange={(event) => onChange('gender', event.target.value)}
        placeholder="M / F / другое значение"
      />
      <AdminSelect
        label="Роль"
        value={draft.role}
        onChange={(event) => onChange('role', event.target.value as UserRole)}
        disabled={roleDisabled}
        helper={
          roleDisabled
            ? 'Текущий администратор не может разжаловать себя через админку.'
            : 'Users и Admins остаются одной сущностью User, меняется только role.'
        }
      >
        <option value="CUSTOMER">Покупатель</option>
        <option value="ADMIN">Администратор</option>
      </AdminSelect>
      <AdminSelect
        label="Статус"
        value={draft.isActive ? 'active' : 'inactive'}
        onChange={(event) => onChange('isActive', event.target.value === 'active')}
        disabled={activityDisabled}
        helper={
          activityDisabled
            ? 'Текущий администратор не может деактивировать себя через админку.'
            : 'Удаление в UI означает soft deactivate, а не hard delete.'
        }
      >
        <option value="active">Активен</option>
        <option value="inactive">Неактивен</option>
      </AdminSelect>
    </div>
  </>
);
