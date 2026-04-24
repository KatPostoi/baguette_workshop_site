import { AdminInput, AdminSelect } from '../AdminField';

export type AdminTeamDraft = {
  id: string | null;
  name: string;
  active: boolean;
};

type AdminTeamEditFormProps = {
  draft: AdminTeamDraft;
  mode: 'create' | 'edit';
  onChange: <TKey extends keyof AdminTeamDraft>(
    key: TKey,
    value: AdminTeamDraft[TKey],
  ) => void;
};

export const AdminTeamEditForm = ({
  draft,
  mode,
  onChange,
}: AdminTeamEditFormProps) => (
  <>
    {draft.id ? (
      <div className="admin-dialog__meta">
        <span className="admin-dialog__meta-label">UUID</span>
        <span className="admin-dialog__meta-value">{draft.id}</span>
      </div>
    ) : null}

    <div className="admin-dialog__form-grid">
      <AdminInput
        label="Название группы"
        value={draft.name}
        onChange={(event) => onChange('name', event.target.value)}
        placeholder="Например, Цех №1"
      />

      {mode === 'edit' ? (
        <AdminSelect
          label="Статус"
          value={draft.active ? 'active' : 'inactive'}
          onChange={(event) => onChange('active', event.target.value === 'active')}
          helper="Неактивная группа исчезает из новых назначений в Заказах, но остаётся в уже назначенных заказах и истории."
        >
          <option value="active">Активна</option>
          <option value="inactive">Неактивна</option>
        </AdminSelect>
      ) : null}
    </div>

    {mode === 'create' ? (
      <p className="admin-teams-dialog__note">
        Новая рабочая группа создаётся активной. Удаление в интерфейсе означает
        мягкую деактивацию, а не физическое удаление из базы.
      </p>
    ) : null}
  </>
);
