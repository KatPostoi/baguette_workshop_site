# Шаг 1. Архитектурная стабилизация и зачистка обязательных противоречий

## 1. Смысл шага
Этот проект уже существует, поэтому `step_1` здесь не про `Hello world` и не про инициализацию технологий с нуля. Эквивалент первого шага для действующего проекта:
- зафиксировать целевую архитектуру `Admin`;
- убрать то, что точно больше не нужно;
- исправить критические противоречия контрактов и моделей, без которых следующий рефакторинг будет строиться на нестабильной базе.

## 2. Цель шага
- [ ] Зафиксировать финальную информационную архитектуру `Admin`: только `Заказы` и `Данные`.
- [ ] Удалить `Аудит` из frontend admin UI.
- [ ] Определить безопасную стратегию удаления для `Users`, `Admins`, `Working Groups`, `Orders`.
- [ ] Выровнять backend/frontend contracts, которые уже подтверждены ревью как сломанные.
- [ ] Подготовить проект к следующему шагу, где будет строиться общий admin-shell.

## 3. Почему шаг обязателен
Если пропустить этот шаг и сразу перейти к новой вёрстке или новым табам, мы просто перенесём текущие дефекты в новую структуру:
- `Admin Orders` уже имеет route mismatch для назначения команды;
- `Team` seed IDs конфликтуют с DTO validation;
- `Styles` не редактируются из-за неверной валидации id;
- `Audit` присутствует в frontend, хотя целевая структура теперь другая.

Это нарушает `KISS` и `YAGNI`: мы бы усложнили UI, не стабилизировав основу.

## 4. Границы шага

### 4.1. Что входит
- удаление `Audit` из frontend;
- фиксация целевой структуры `Admin`;
- исправление базовых API/DTO/seed-противоречий;
- проектирование жизненного цикла сущностей для delete/deactivate;
- выравнивание имён файлов спецификаций и внутренних ссылок.

### 4.2. Что не входит
- полноценная новая вёрстка `Admin`;
- декомпозиция `AdminData` по табам;
- реализация новых вкладок `Users/Admins/Working Groups`;
- полный backend CRUD для новых сущностей.

## 5. Разбор текущей архитектуры и обязательные выводы

### 5.1. Frontend
- [ ] [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:67) содержит маршрут `/admin/audit`, который больше не соответствует целевой архитектуре.
- [ ] [website/src/components/admin/AdminShell.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.tsx:18) жёстко зашивает 3-секционную поднавигацию.
- [ ] [website/src/state/permissions.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/state/permissions.ts:1) содержит `audit:read`, который после удаления audit-UI может остаться мёртвым frontend-кодом.
- [ ] [website/src/api/orders.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/api/orders.ts:60) смешивает order API и team API.
- [ ] [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:80) уже завязан на сломанный сценарий назначения команды.

### 5.2. Backend
- [ ] [backend/app/src/modules/orders/admin-orders.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/admin-orders.controller.ts:22) не имеет `PATCH :id/team`, хотя frontend ожидает именно admin endpoint.
- [ ] [backend/app/src/modules/orders/orders.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/orders.controller.ts:93) содержит admin-only действие под публичным route-prefix `/orders`.
- [ ] [backend/app/src/modules/styles/admin-styles.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/styles/admin-styles.controller.ts:33) использует `ParseUUIDPipe`, хотя `FrameStyle.id` не UUID.
- [ ] [backend/app/src/modules/teams/teams.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/teams/teams.controller.ts:17) не имеет delete/deactivate endpoint.
- [ ] [backend/app/src/modules/users/admin-users.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/users/admin-users.controller.ts:1) пока умеет только list/search.

### 5.3. База данных и seed
- [ ] `Team.id` в схеме уже `uuid`-friendly по смыслу: [backend/app/prisma/schema.prisma](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/schema.prisma:238)
- [ ] Но seed использует идентификаторы, которые валидатор отвергает как UUID: [backend/app/prisma/seed.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/seed.ts:495)
- [ ] `User` пока не имеет безопасного lifecycle-флага (`isActive` / `deletedAt`): [backend/app/prisma/schema.prisma](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/schema.prisma:122)

## 6. Архитектурные решения, которые нужно зафиксировать на шаге

### 6.1. Удаление `Audit`
- [ ] Удаляем `Audit` только из frontend admin UI.
- [ ] Backend audit-модуль пока не трогаем, потому что он остаётся полезным техническим механизмом.
- [ ] Это лучший вариант сейчас:
  - не ломает серверную диагностику;
  - не размазывает задачу;
  - соответствует `YAGNI`.

### 6.2. Стратегия для `Users` и `Admins`
- [ ] `Admins` не становятся новой сущностью.
- [ ] `Users` и `Admins` строятся поверх одной таблицы `User`, различаясь фильтром `role`.
- [ ] Рекомендуемая стратегия удаления:
  - не hard delete;
  - ввести `isActive Boolean @default(true)` как минимальный безопасный вариант;
  - soft delete = `isActive = false`.
- [ ] Почему `isActive`, а не `deletedAt` на первом цикле:
  - проще миграция;
  - проще фильтрация;
  - меньше объём изменений;
  - достаточно для текущей задачи.

### 6.3. Стратегия для `Working Groups`
- [ ] `Working Groups` = `Team`.
- [ ] Не создаём новую таблицу.
- [ ] Удаление реализуем как `active=false`, так как поле уже существует.
- [ ] Это максимально соответствует `KISS` и `YAGNI`.

### 6.4. Стратегия для `Orders`
- [ ] Для заказов не делать физическое удаление.
- [ ] Если в будущем UI будет требовать кнопку `Удалить`, её нужно трактовать как:
  - `архивировать` или
  - `скрыть из активного списка`,
  а не как hard delete.
- [ ] На этом шаге это решение нужно именно зафиксировать, а не реализовывать.

## 7. Подробный план выполнения

### 7.1. Frontend

#### 7.1.1. Удаление audit-страницы
- [ ] Удалить route `/admin/audit` из [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:67)
- [ ] Удалить import `AdminAuditPage` из [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:18)
- [ ] Удалить ссылку `Аудит` из [website/src/components/admin/AdminShell.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.tsx:18)
- [ ] Проверить, что переход `/admin` по-прежнему ведёт на `/admin/orders`
- [ ] Удалить:
  - `website/src/pages/AdminAudit.tsx`
  - `website/src/pages/AdminAudit.css`
  - `website/src/api/audit.ts`

#### 7.1.2. Зачистка permissions и imports
- [ ] Удалить `audit:read` из [website/src/state/permissions.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/state/permissions.ts:1), если после удаления audit UI он больше нигде не используется.
- [ ] Проверить, нет ли мёртвых импортов и ссылок на `AdminAudit`.

#### 7.1.3. Приведение admin API-клиентов к domain boundaries
- [ ] Вынести team-операции из [website/src/api/orders.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/api/orders.ts:1) в отдельный `website/src/api/teams.ts`
- [ ] Оставить в `orders.ts` только order-specific операции.
- [ ] Зафиксировать naming convention для admin API-клиентов:
  - один файл = одна сущность или один bounded context

### 7.2. Backend

#### 7.2.1. Orders / Teams contracts
- [ ] Добавить `PATCH /admin/orders/:id/team` в [backend/app/src/modules/orders/admin-orders.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/admin-orders.controller.ts:22)
- [ ] Либо временно оставить public admin-only route `/orders/:id/team`, но canonical endpoint должен стать admin-prefixed
- [ ] Привести фронтенд и backend к одному согласованному контракту

#### 7.2.2. Styles contracts
- [ ] Убрать `ParseUUIDPipe` из [backend/app/src/modules/styles/admin-styles.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/styles/admin-styles.controller.ts:33)
- [ ] Явно зафиксировать, что `FrameStyle.id` — строковый key, а не UUID
- [ ] Проверить, что update/delete для стилей становятся рабочими на существующих данных

#### 7.2.3. Users / Teams lifecycle design
- [ ] Спроектировать новые backend endpoints, которые будут реализованы в следующих шагах:
  - `PATCH /admin/users/:id`
  - `DELETE /admin/users/:id` как deactivate
  - `DELETE /admin/teams/:id` как deactivate
- [ ] Зафиксировать DTO и permission model без преждевременной реализации всего CRUD на этом шаге

### 7.3. Database / Prisma
- [ ] Исправить team IDs в seed на реальные UUID v4
- [ ] Обновить связанные `order.teamId` в seed
- [ ] Подготовить решение по `User.isActive`
- [ ] Решить, будет ли миграция `User.isActive` выполнена уже в конце step_1 или перенесена в step_5
  - рекомендовано: спроектировать на step_1, внедрить в step_5 вместе с users/admins UI

## 8. Файлы, которые нужно будет править

### 8.1. Frontend
- `website/src/App.tsx`
- `website/src/components/admin/AdminShell.tsx`
- `website/src/components/admin/AdminShell.css`
- `website/src/state/permissions.ts`
- `website/src/api/orders.ts`
- `website/src/api/audit.ts`
- `website/src/pages/AdminAudit.tsx`
- `website/src/pages/AdminAudit.css`
- `website/src/pages/AdminDashboard.tsx`
- `website/src/api/teams.ts` (новый файл)

### 8.2. Backend
- `backend/app/src/modules/orders/admin-orders.controller.ts`
- `backend/app/src/modules/orders/orders.controller.ts`
- `backend/app/src/modules/orders/orders.service.ts`
- `backend/app/src/modules/orders/dto/assign-team.dto.ts`
- `backend/app/src/modules/orders/dto/admin-order-filter.dto.ts`
- `backend/app/src/modules/styles/admin-styles.controller.ts`
- `backend/app/src/modules/teams/teams.controller.ts`
- `backend/app/src/modules/users/admin-users.controller.ts`

### 8.3. Database / Infra
- `backend/app/prisma/schema.prisma`
- `backend/app/prisma/seed.ts`

## 9. Лучшие практики для выполнения шага
- `Single Responsibility`: не смешивать удаление `Audit`, фикс стилей и проектирование новых вкладок в один гигантский PR без внутренней декомпозиции.
- `Open/Closed`: backend-контракты расширять точечно, а не переписывать целиком существующие модули.
- `DRY`: если выносится `teams.ts`, не дублировать типы в разных API-файлах.
- `KISS`: пока не добавлять сложную систему feature flags и meta-config.
- `YAGNI`: не внедрять полноценную ролевую матрицу нового поколения, пока реальный сценарий покрывается текущими ролями `ADMIN/CUSTOMER`.

## 10. Риски шага
- [ ] Риск: удалить `Audit` только визуально, но оставить мёртвый код и импорты.
- [ ] Риск: исправить frontend route, но не исправить canonical backend contract.
- [ ] Риск: изменить seed IDs команд, но забыть обновить заказы и сценарии фильтрации.
- [ ] Риск: начать реализовывать user delete без soft delete policy.

## 11. Артефакты результата
- [ ] В frontend отсутствует `Audit`-раздел.
- [ ] Спецификация сущностей и delete-стратегий зафиксирована.
- [ ] Основные contract mismatches из ревью закрыты или декомпозированы до конкретных задач.
- [ ] Проект готов к step_2 без архитектурной двусмысленности.

## 12. Проверки после выполнения шага
- [ ] `npm run lint:check` в `website`
- [ ] `npm run lint:check` в `backend/app`
- [ ] smoke-проверка маршрутов:
  - `/admin`
  - `/admin/orders`
  - `/admin/data`
- [ ] проверка, что во frontend нет ссылок на `/admin/audit`
- [ ] проверка, что team assignment и styles contract больше не конфликтуют с DTO/route validation

## 13. Финальная проверка, что ничего не забыто
- [ ] `Audit` удалён из frontend routes
- [ ] `Audit` удалён из frontend subnav
- [ ] frontend dead code по audit зачищен
- [ ] canonical route для team assignment определён
- [ ] конфликт team UUID устранён или явно закрыт задачей
- [ ] конфликт styles ID устранён или явно закрыт задачей
- [ ] delete policy для `Users / Admins / Teams / Orders` зафиксирована
- [ ] проект готов к построению общего admin-shell
