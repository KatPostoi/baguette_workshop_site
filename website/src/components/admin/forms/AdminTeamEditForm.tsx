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
      >
        <option value="active">Активна</option>
        <option value="inactive">Неактивна</option>
      </AdminSelect>
    ) : null}
  </div>
);
