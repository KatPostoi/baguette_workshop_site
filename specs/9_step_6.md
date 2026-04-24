# Шаг 6. Вкладка `Рабочие группы`

## 1. Цель шага
- [ ] Добавить вкладку `Рабочие группы` в `Data`.
- [ ] Построить её поверх существующей сущности `Team`.
- [ ] Поддержать безопасные действия `Редактировать` и `Удалить`.

## 2. Ключевое архитектурное решение
- [ ] `Working Groups` = `Team`
- [ ] Не создаём новую таблицу, новый Prisma model и новый domain без необходимости.
- [ ] Поле `active` уже существует, поэтому soft delete здесь почти готов из коробки.

Это лучший вариант:
- минимальные изменения в схеме;
- reuse уже существующей связи `Order.teamId`;
- отсутствие лишней модели соответствует `YAGNI`.

## 3. Текущая архитектура и ограничения
- [ ] Backend уже имеет `GET /admin/teams`, `POST /admin/teams`, `PATCH /admin/teams/:id`
- [ ] Во frontend сейчас нет отдельного `teams`-раздела
- [ ] `orders` уже используют команды, поэтому любые изменения lifecycle `Team` напрямую влияют на `Orders`
- [ ] Seed команд уже требует исправления UUID

## 4. Решение по delete semantics
- [ ] `Удалить` = `active=false`
- [ ] По умолчанию список показывает только активные группы
- [ ] Должен быть фильтр активности:
  - активные
  - неактивные
  - все
- [ ] Физическое удаление не рекомендовано, потому что:
  - команды уже связаны с заказами;
  - исторические заказы должны сохранять referential integrity;
  - inactive group достаточно для текущей задачи.

## 5. Подробный план выполнения

### 5.1. Backend
- [ ] Исправить UUID consistency для `Team`
- [ ] Добавить `DELETE /admin/teams/:id` как soft delete/deactivate
- [ ] Расширить `GET /admin/teams` фильтрами:
  - `search`
  - `active`
- [ ] Проверить, как inactive команды ведут себя в `Orders`:
  - можно ли показывать их в старых заказах
  - нужно ли скрывать их из selector для новых назначений

### 5.2. Frontend API
- [ ] Создать `website/src/api/teams.ts`
- [ ] Вынести туда:
  - list
  - create
  - update
  - delete/deactivate
- [ ] Не держать это в `orders.ts`

### 5.3. Frontend tab
- [ ] Создать `AdminTeamsTab.tsx`
- [ ] Реализовать:
  - filter/search block
  - list block
  - row actions `Редактировать` / `Удалить`
  - create/edit modal or side panel

### 5.4. Связь с `Orders`
- [ ] Проверить, что `Orders` используют только активные команды в селектах назначения
- [ ] Проверить, что уже назначенные inactive команды всё ещё корректно отображаются в истории/карточках

## 6. Файлы, которые нужно будет править

### 6.1. Frontend
- `website/src/api/teams.ts`
- `website/src/pages/AdminData.tsx`
- `website/src/components/admin/tabs/AdminTeamsTab.tsx`
- `website/src/components/admin/forms/AdminTeamEditForm.tsx`
- `website/src/pages/AdminDashboard.tsx`

### 6.2. Backend
- `backend/app/prisma/schema.prisma`
- `backend/app/prisma/seed.ts`
- `backend/app/src/modules/teams/teams.controller.ts`
- `backend/app/src/modules/teams/teams.service.ts`
- `backend/app/src/modules/teams/dto/create-team.dto.ts`
- `backend/app/src/modules/teams/dto/update-team.dto.ts`
- `backend/app/src/modules/orders/orders.service.ts`

## 7. Senior refactoring guidance

### 7.1. Как лучше встроить `Teams`
Лучший вариант:
- независимый admin-tab в `Data`
- собственный API-файл
- reuse общих admin UI primitives
- order page использует только `teams` API, а не team logic inside `orders.ts`

### 7.2. Как не надо делать
- не хранить teams CRUD внутри `AdminDashboard`
- не делать второй набор логики команд только ради `Working Groups`
- не смешивать active/inactive business rules в нескольких местах без общего helper/policy

## 8. Дополнительные улучшения кода и логики
- [ ] Добавить защиту от деактивации группы, если она используется как default/единственная активная
- [ ] Добавить понятные labels для inactive rows
- [ ] Добавить empty state для отсутствия рабочих групп
- [ ] Добавить сортировку по имени и активности

## 9. Риски шага
- [ ] Риск: деактивация команды ломает orders selectors
- [ ] Риск: UI показывает inactive teams как доступные для нового назначения
- [ ] Риск: `Team` логика остаётся размазанной между `orders.ts`, `AdminDashboard`, `AdminTeamsTab`

## 10. Артефакты результата
- [ ] Есть вкладка `Рабочие группы`
- [ ] Работает filter/search
- [ ] Работает `Редактировать`
- [ ] Работает безопасный `Удалить`
- [ ] `Orders` корректно интегрированы с lifecycle команд

## 11. Проверки после выполнения шага
- [ ] list teams
- [ ] search teams
- [ ] edit team
- [ ] deactivate team
- [ ] visibility inactive teams in orders selectors
- [ ] display existing inactive team in already assigned orders

## 12. Финальная проверка, что ничего не забыто
- [ ] `Working Groups` построены поверх `Team`
- [ ] delete = deactivate
- [ ] `teams.ts` отделён от `orders.ts`
- [ ] `Orders` корректно реагируют на inactive teams
- [ ] UI tab соответствует общему shell
