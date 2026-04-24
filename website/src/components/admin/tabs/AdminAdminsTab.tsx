import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';

export const AdminAdminsTab = () => (
  <>
    <AdminFilterPanel>
      <AdminInput
        label="Поиск администраторов"
        placeholder="Поиск по email и ФИО появится на следующем шаге"
        disabled
      />
      <AdminSelect label="Статус" value="" disabled>
        <option value="">Все администраторы</option>
      </AdminSelect>
    </AdminFilterPanel>

    <AdminListBlock
      title="Администраторы"
      description="Sandbox-вкладка подготовлена заранее. Лучший вариант для следующего шага: строить её как отдельную проекцию сущности User с role=ADMIN, а не плодить новую модель."
    >
      <AdminListState
        isEmpty
        emptyMessage="На этом шаге вкладка служит каркасом: фильтры, list block и будущая точка расширения уже готовы."
      />
    </AdminListBlock>
  </>
);
