import { AdminFilterPanel } from '../AdminFilterPanel';
import { AdminInput, AdminSelect } from '../AdminField';
import { AdminListBlock } from '../AdminListBlock';
import { AdminListState } from '../AdminListState';

export const AdminTeamsTab = () => (
  <>
    <AdminFilterPanel>
      <AdminInput
        label="Поиск групп"
        placeholder="Поиск по рабочим группам подключим на шаге teams management"
        disabled
      />
      <AdminSelect label="Статус" value="" disabled>
        <option value="">Только активные группы</option>
      </AdminSelect>
    </AdminFilterPanel>

    <AdminListBlock
      title="Рабочие группы"
      description="Вкладка уже встроена в новый Admin shell. На следующем шаге она будет подключена к сущности Team и soft-delete через active=false."
    >
      <AdminListState
        isEmpty
        emptyMessage="Сейчас это sandbox-каркас без live CRUD, чтобы следующий шаг не ломал структуру страницы."
      />
    </AdminListBlock>
  </>
);
