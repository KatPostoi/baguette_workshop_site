# Шаг 4. Декомпозиция `AdminData` и стабилизация существующих вкладок

## 1. Цель шага
- [ ] Разбить `AdminData` на независимые tab-модули.
- [ ] Привести `Каталог`, `Материалы`, `Стили`, `Услуги` к единому CRUD-паттерну.
- [ ] Подготовить страницу `Data` к расширению без превращения её в новый монолит.

## 2. Почему шаг идёт отдельно
Сначала нужен общий shell и рабочий эталон на `Orders`, и только потом безопасно переносить существующий data CRUD в модульную структуру. Иначе мы бы одновременно:
- строили layout;
- чинили старые баги;
- добавляли новые вкладки;
- декомпозировали самый большой файл проекта.

Это слишком высокий риск регрессии.

## 3. Текущая архитектура и проблемы
- [ ] [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:92) содержит сразу все сущности и все CRUD-обработчики.
- [ ] Формы редактирования встроены в страницу как giant inline blocks.
- [ ] `Styles` сейчас функционально сломаны на backend-контракте и должны быть исправлены до или в рамках этого шага.
- [ ] Логика пользователей уже частично зашита в `AdminData`, но отдельной архитектуры под `Users/Admins` ещё нет.

## 4. Архитектурные решения шага

### 4.1. Структура страницы `Data`
- [ ] `AdminData.tsx` становится container/orchestrator.
- [ ] Каждая вкладка становится отдельным компонентом.
- [ ] Общие loading/empty/error/filter/list/action паттерны используют admin-shell primitives из step_2.

### 4.2. Edit flow
- [ ] Лучший вариант: modal/drawer/form panel для редактирования записи.
- [ ] Не держать большую always-open форму над списком как постоянный глобальный state страницы.
- [ ] Для простых сущностей можно использовать боковую панель или modal; для текущего проекта modal будет проще и дешевле.

### 4.3. Delete flow
- [ ] Во всех текущих вкладках сохраняем явные кнопки:
  - `Редактировать`
  - `Удалить`
- [ ] Для delete использовать единый confirm-flow.
- [ ] Не дублировать `confirm(...)` в каждом tab-компоненте вручную, если можно вынести thin helper/pattern.

## 5. Подробный план выполнения

### 5.1. Разделение `AdminData.tsx`
- [ ] Оставить в `AdminData.tsx`:
  - active tab
  - page title
  - tab bar
  - общую orchestration shell
- [ ] Вынести существующие вкладки в:
  - `AdminCatalogTab.tsx`
  - `AdminMaterialsTab.tsx`
  - `AdminStylesTab.tsx`
  - `AdminServicesTab.tsx`
- [ ] Подготовить shared types/props для tab components

### 5.2. Catalog
- [ ] Стабилизировать list/search/pagination
- [ ] Перевести edit flow в отдельную форму/modal
- [ ] Проверить обязательные поля и backend DTO
- [ ] Оставить `Редактировать` и `Удалить` у каждой строки

### 5.3. Materials
- [ ] Перевести список материалов на общий tab contract
- [ ] Сохранить edit/delete actions
- [ ] Проверить числовые поля и валидацию

### 5.4. Styles
- [ ] Сначала выровнять backend contract для string IDs
- [ ] Затем подключить полноценные edit/delete actions
- [ ] Сделать `Styles` первым табом, где явно проверяется, что новый tab architecture не мешает нестандартному string ID

### 5.5. Services
- [ ] Выровнять naming и list/edit/delete UX
- [ ] Зафиксировать, что tab работает через те же layout-примитивы, что и остальные

## 6. Файлы, которые нужно будет править

### 6.1. Frontend
- `website/src/pages/AdminData.tsx`
- `website/src/pages/AdminData.css`
- `website/src/api/catalog.ts`
- `website/src/api/materials.ts`
- `website/src/api/styles.ts`
- `website/src/api/services.ts`
- `website/src/components/admin/tabs/AdminCatalogTab.tsx`
- `website/src/components/admin/tabs/AdminMaterialsTab.tsx`
- `website/src/components/admin/tabs/AdminStylesTab.tsx`
- `website/src/components/admin/tabs/AdminServicesTab.tsx`
- `website/src/components/admin/forms/*` (если будет выделен общий form layer)

### 6.2. Backend
- `backend/app/src/modules/catalog/admin-catalog.controller.ts`
- `backend/app/src/modules/catalog/catalog.service.ts`
- `backend/app/src/modules/materials/admin-materials.controller.ts`
- `backend/app/src/modules/materials/materials.service.ts`
- `backend/app/src/modules/styles/admin-styles.controller.ts`
- `backend/app/src/modules/styles/styles.service.ts`
- `backend/app/src/modules/service-items/admin-service-items.controller.ts`
- `backend/app/src/modules/service-items/service-items.service.ts`

## 7. Senior refactoring guidance

### 7.1. Как лучше организовать tab-компоненты
Каждый tab должен иметь одинаковую внутреннюю структуру:
1. hook/state section
2. filter panel
3. list block
4. modal/edit state
5. action handlers

Это даст:
- одинаковую читаемость;
- проще code review;
- проще перенос паттерна в новые tab-компоненты.

### 7.2. Как не надо делать
- не создавать один супер-хук `useAdminDataPageEverything`;
- не делать один generic CRUD component с десятками render props;
- не смешивать tab rendering и network orchestration в одном уровне абстракции.

## 8. Дополнительные улучшения кода и логики
- [ ] Ввести локальные адаптеры данных между API response и UI draft shape, чтобы tab-компоненты не зависели напрямую от raw DTO
- [ ] Подготовить общий `entity draft -> payload` mapper pattern
- [ ] Свести дублирующиеся search/pagination patterns к shared helpers

## 9. Риски шага
- [ ] Риск: формально вынести табы по файлам, но оставить всю логику в parent через giant prop drilling
- [ ] Риск: исправить layout, но не исправить broken style CRUD
- [ ] Риск: повторить inline-form anti-pattern уже в новых tab-компонентах

## 10. Артефакты результата
- [ ] `AdminData.tsx` стал контейнером, а не монолитом
- [ ] `Catalog / Materials / Styles / Services` работают по одному UX-паттерну
- [ ] У каждой строки есть `Редактировать` и `Удалить`
- [ ] Страница готова к добавлению `Users/Admins/Teams`

## 11. Проверки после выполнения шага
- [ ] Переключение всех existing tabs
- [ ] Search/filter внутри каждого existing tab
- [ ] Edit action внутри каждого existing tab
- [ ] Delete action внутри каждого existing tab
- [ ] Проверка `Styles` edit/delete после выравнивания backend contract

## 12. Финальная проверка, что ничего не забыто
- [ ] `AdminData` декомпозирован
- [ ] Existing tabs выделены в отдельные компоненты
- [ ] Общий CRUD-pattern соблюдён
- [ ] Inline giant form anti-pattern устранён
- [ ] `Styles` больше не сломаны контрактно
