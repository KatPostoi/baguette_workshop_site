# Ревью `baguette_workshop_site`

## Findings

### Critical
- Подтверждённых `critical`-проблем не найдено.

### High

#### 1. `Admin`-назначение команды бьётся в несуществующий backend-маршрут
- Область: `admin`, `frontend`, `backend`
- Почему это проблема: страница заказов отправляет назначение команды на `/admin/orders/:id/team`, но такого маршрута в `AdminOrdersController` нет. Рабочий маршрут объявлен в другом контроллере как `/orders/:id/team`.
- Как проявляется: из `Admin -> Orders` назначение команды всегда завершается ошибкой, даже до выполнения бизнес-логики.
- Доказательства:
  - фронтенд вызывает `/admin/orders/${id}/team`: [website/src/api/orders.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/api/orders.ts:60)
  - админский контроллер не содержит `@Patch(':id/team')`: [backend/app/src/modules/orders/admin-orders.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/admin-orders.controller.ts:22)
  - существующий маршрут объявлен только в публичном `OrdersController`: [backend/app/src/modules/orders/orders.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/orders.controller.ts:93)
  - UI действительно использует этот сценарий: [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:80), [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:243)
  - runtime: `PATCH /api/admin/orders/b06d7a6c-6e62-4a9d-a4f5-7adfd67551c5/team` вернул `404 Cannot PATCH /admin/orders/.../team`
- Шаги воспроизведения:
  1. Поднять `./start-all.sh dev`
  2. Войти как `admin1@baguette.local / password`
  3. Открыть `/admin/orders`
  4. Попробовать назначить команду любому заказу
- Рекомендуемое направление исправления: выровнять контракт. Либо добавить `@Patch(':id/team')` в [AdminOrdersController](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/admin-orders.controller.ts:22), либо перевести фронтенд на уже существующий `/orders/:id/team`, а затем покрыть это e2e-smoke-тестом.

#### 2. Team-based сценарии в `Admin Orders` неработоспособны из-за конфликта seed-данных с UUID-валидацией
- Область: `admin`, `backend`, `database`
- Почему это проблема: UI загружает команды из seed и передаёт их `id` в фильтры и назначение, но backend DTO требует `UUID`, а текущие team IDs эти проверки не проходят.
- Как проявляется: фильтр по команде ломает загрузку заказов, назначение команды через рабочий backend-маршрут тоже падает на валидации, а существующий `PATCH /admin/teams/:id` также ожидает UUID.
- Доказательства:
  - seed-команды используют значения вида `aaa11111-...`: [backend/app/prisma/seed.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/seed.ts:495)
  - фильтры заказов валидируют `teamId` как `@IsUUID()`: [backend/app/src/modules/orders/dto/admin-order-filter.dto.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/dto/admin-order-filter.dto.ts:24)
  - назначение команды валидирует `teamId` как `@IsUUID()`: [backend/app/src/modules/orders/dto/assign-team.dto.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/dto/assign-team.dto.ts:3)
  - обновление команды по API тоже ожидает UUID в path: [backend/app/src/modules/teams/teams.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/teams/teams.controller.ts:33)
  - UI безусловно подставляет эти IDs в фильтр и селект назначения: [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:171), [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:243)
  - runtime:
    - `GET /api/admin/orders?teamId=aaa11111-...` -> `400 teamId must be a UUID`
    - аналогично для всех четырёх seed-команд
    - `PATCH /api/orders/b06d7a6c-.../team` c `teamId=ddd44444-...` -> `400 teamId must be a UUID`
- Шаги воспроизведения:
  1. Войти в `/admin/orders`
  2. Выбрать любую команду в верхнем фильтре или в карточке заказа
  3. Нажать `Обновить` или сменить назначение
- Рекомендуемое направление исправления: выбрать один формат идентификаторов и провести его через весь стек. Практичнее всего перевести `Team.id` и seed на реальные UUIDv4, затем пересоздать связанные seed-данные и покрыть фильтр/назначение интеграционными тестами.

#### 3. Редактирование и удаление стилей в `Admin Data` невозможно при текущей модели данных
- Область: `admin`, `backend`, `database`
- Почему это проблема: `FrameStyle.id` в Prisma является произвольной строкой (`baroque`, `minimalism`), но админские `PATCH/DELETE /admin/styles/:id` пропускают `id` через `ParseUUIDPipe`.
- Как проявляется: все существующие стили отображаются в UI и предлагают кнопки `Редактировать` / `Удалить`, но оба действия падают на `400 Validation failed (uuid is expected)`.
- Доказательства:
  - модель данных хранит string ID, а не UUID: [backend/app/prisma/schema.prisma](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/schema.prisma:50)
  - фронтенд работает именно с такими string ID: [website/src/api/styles.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/api/styles.ts:9), [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:706)
  - backend требует UUID для update/delete: [backend/app/src/modules/styles/admin-styles.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/styles/admin-styles.controller.ts:33)
  - runtime:
    - `PATCH /api/admin/styles/baroque` -> `400 Validation failed (uuid is expected)`
    - `DELETE /api/admin/styles/baroque` -> `400 Validation failed (uuid is expected)`
- Шаги воспроизведения:
  1. Открыть `/admin/data`
  2. Перейти в таб `Стили`
  3. Нажать `Редактировать` или `Удалить` для любого существующего стиля
- Рекомендуемое направление исправления: убрать `ParseUUIDPipe` для style ID и трактовать `:id` как строковый key, либо мигрировать `FrameStyle.id` на UUID во всей схеме, seed и фронтенде. Первый вариант здесь дешевле и согласован с текущими данными.

### Medium

#### 4. UI-фильтры в `Admin` обещают поиск по email, но backend принимает только UUID / actorId
- Область: `admin`, `frontend`, `backend`
- Почему это проблема: интерфейс подсказывает администратору вводить email, но backend либо валидирует UUID, либо ищет только по `actorId`.
- Как проявляется:
  - в `Orders` поле `Пользователь (id/email)` и placeholder `UUID или email` вводят в заблуждение: email приводит к `400`
  - в `Audit` поле `Пользователь (email)` фактически не ищет по email, потому что backend фильтрует `where.actorId = ...`
- Доказательства:
  - `Orders` UI: [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:184)
  - `Orders` backend: [backend/app/src/modules/orders/dto/admin-order-filter.dto.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/dto/admin-order-filter.dto.ts:20)
  - `Audit` UI: [website/src/pages/AdminAudit.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminAudit.tsx:112)
  - `Audit` controller/service принимают и используют только `actorId`: [backend/app/src/modules/audit/audit.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/audit/audit.controller.ts:12), [backend/app/src/modules/audit/audit.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/audit/audit.service.ts:49)
  - runtime:
    - `GET /api/admin/orders?userId=customer1@baguette.local` -> `400 userId must be a UUID`
    - после создания audit-события `actorId=admin1@baguette.local` дал `0` записей, а `actorId=<uuid admin1>` дал `1`
- Шаги воспроизведения:
  1. В `Admin Orders` ввести email в фильтр пользователя и нажать `Обновить`
  2. В `Admin Audit` ввести email администратора в фильтр пользователя и нажать `Обновить`
- Рекомендуемое направление исправления: либо честно ограничить UI до UUID, либо добавить backend-поддержку поиска по email через relation/lookup. Для админки полезнее второй вариант.

#### 5. Таксономия audit action на фронтенде расходится с реально записываемыми action в backend
- Область: `admin`, `frontend`, `backend`
- Почему это проблема: фильтры аудита построены на жёстко зашитых строках, но backend пишет другие значения. В итоге часть событий существует в журнале, но не находится через UI-фильтр.
- Как проявляется:
  - UI предлагает `order_assign_team`, но backend пишет `order_team_assigned`
  - UI предлагает `service_update`, а backend пишет `service_item_update`
  - backend пишет `order_status_bulk_change`, но такого пункта нет в UI
  - UI предлагает `login/logout/refresh`, но соответствующая запись в audit вообще не ведётся
- Доказательства:
  - UI action options: [website/src/pages/AdminAudit.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminAudit.tsx:28)
  - backend actions по заказам: [backend/app/src/modules/orders/orders.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/orders.service.ts:254), [backend/app/src/modules/orders/orders.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/orders.service.ts:339), [backend/app/src/modules/orders/orders.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/orders/orders.service.ts:390)
  - backend actions по услугам: [backend/app/src/modules/service-items/service-items.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/service-items/service-items.service.ts:44), [backend/app/src/modules/service-items/service-items.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/service-items/service-items.service.ts:76)
  - runtime: после `PATCH /api/admin/services/1` фильтр `action=service_update` вернул `0`, а `action=service_item_update` вернул `1`
- Шаги воспроизведения:
  1. Обновить любую услугу через `/admin/data`
  2. Открыть `/admin/audit`
  3. Отфильтровать по `Обновление услуги`
- Рекомендуемое направление исправления: вынести action names в единый enum/shared contract между backend и frontend и использовать только его. Отдельно решить, какие auth-события должны реально аудитироваться.

#### 6. Backend поддерживает управление командами, но во frontend для этого нет ни маршрута, ни вкладки, ни поднавигации
- Область: `admin`, `frontend`, `backend`
- Почему это проблема: API для команд уже есть, однако из админки их нельзя ни создать, ни переименовать, ни деактивировать. При этом другие части `Admin` зависят от существования и качества данных команд.
- Как проявляется: команды доступны только как read-only список в селектах заказов; полноценный CRUD для команд отсутствует в UI.
- Доказательства:
  - backend `GET/POST/PATCH /admin/teams`: [backend/app/src/modules/teams/teams.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/teams/teams.controller.ts:17)
  - во frontend нет маршрута `/admin/teams`: [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:67)
  - в subnav нет ссылки на команды: [website/src/components/admin/AdminShell.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.tsx:18)
  - в `AdminData` нет соответствующего tab: [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:121)
- Шаги воспроизведения:
  1. Войти в админку
  2. Просмотреть все маршруты `/admin/*` и вкладки `Admin Data`
  3. Попробовать найти UI для создания/редактирования команд
- Рекомендуемое направление исправления: добавить отдельный экран `/admin/teams` или tab в `/admin/data`, либо удалить/заморозить backend-API до появления UI, чтобы не создавать ложное впечатление о полноте Admin.

#### 7. Хэш пароля логируется при регистрации пользователя
- Область: `backend`
- Почему это проблема: даже bcrypt-хэш не должен попадать в обычные application logs. Это лишняя чувствительная информация, увеличивающая риск утечки и нарушающая минимально необходимый уровень безопасности.
- Как проявляется: каждый `POST /auth/register` печатает `passwordHash` в stdout backend-процесса.
- Доказательства:
  - прямой `console.log(passwordHash)`: [backend/app/src/modules/auth/auth.service.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/auth/auth.service.ts:44)
- Шаги воспроизведения:
  1. Запустить backend
  2. Выполнить регистрацию нового пользователя
  3. Проверить stdout/logs backend-контейнера
- Рекомендуемое направление исправления: удалить лог полностью. Если нужен след регистрации, писать только безопасное audit-событие без хэшей и токенов.

## Verification Performed
- Статические проверки:
  - `website`: `npm run typecheck` -> `0`
  - `website`: `npm run lint:check` -> `0`
  - `backend/app`: `npm run typecheck` -> `0`
  - `backend/app`: `npm run lint:check` -> `0`
- Runtime, `dev`-контур:
  - `./start-all.sh dev` -> стек поднялся успешно
  - подтверждена готовность контейнеров `postgres`, `backend`, `website`, `nginx`
  - `docker exec baguette-backend-dev ... fetch('http://127.0.0.1:3000/health')` -> `200 {"status":"ok",...}`
  - в браузере открыт `http://127.0.0.1:6313/`, выполнен login `admin1@baguette.local / password`
  - проверены `/admin/orders`, `/admin/data`, API `/api/admin/orders`, `/api/admin/audit`, `/api/admin/services`, `/api/admin/styles`, `/api/admin/teams`
- Runtime-проверки, которыми подтверждены findings:
  - `PATCH /api/admin/orders/:id/team` -> `404`
  - `GET /api/admin/orders?teamId=<seed-team-id>` -> `400`
  - `PATCH /api/orders/:id/team` c seed `teamId` -> `400`
  - `PATCH /api/admin/orders/:id/status` -> `200`, после чего `actorId=<email>` в audit дал `0`, а `actorId=<uuid>` дал `1`
  - `PATCH /api/admin/services/1` -> `200`, затем `action=service_update` дал `0`, `action=service_item_update` дал `1`
  - `PATCH/DELETE /api/admin/styles/baroque` -> `400 Validation failed (uuid is expected)`
- Runtime, `test`-контур:
  - `./start-all.sh test` был запущен
  - запуск дошёл до сборки production backend-образа и упал внутри `yarn install` на загрузке `@prisma/engines` с `ECONNRESET`
  - это подтверждает, что `test`-режим не был полностью верифицирован в текущей среде

## Assumptions
- `ECONNRESET` при `./start-all.sh test` интерпретирован как внешнее сетевое ограничение/сбой сборки, а не как доказанный дефект кода проекта.
- Ревью оценивает текущую реализацию в коде и подтверждённое runtime-поведение; продуктовая полнота вне существующего кода не оценивалась.
- Проверки выполнялись на demo-seed данных; повторный запуск Prisma seed в процессе ревью использовался для возврата среды к предсказуемому состоянию.

## Open Questions
- Блокирующих вопросов для оценки текущей реализации не осталось.
- Отдельно стоит повторно прогнать `./start-all.sh test` в среде без сетевых ограничений, чтобы отделить инфраструктурный network-flake от возможного дефекта Docker build.

## Quick Wins
1. Выровнять маршрут назначения команды: один canonical endpoint для admin UI, backend controller и фронтенд API-клиента.
2. Привести `Team.id` и связанные DTO/seed к единому валидному формату идентификаторов.
3. Убрать `ParseUUIDPipe` из admin-операций со стилями или мигрировать `FrameStyle.id` на UUID последовательно во всём проекте.
4. Синхронизировать текст и поведение admin-фильтров пользователей: либо UUID-only, либо полноценный поиск по email.
5. Вынести audit action names в shared enum и переиспользовать его во frontend и backend.
6. Добавить UI для `teams` или убрать ложное ожидание поддержки этого раздела в текущей админке.
7. Удалить логирование `passwordHash` из регистрации и заменить его безопасным audit/event logging.

## Admin Priority Map
- В первую очередь:
  - `Orders`: починить назначение команды, фильтр по команде и согласованность маршрутов
  - `Data -> Styles`: восстановить update/delete для существующих стилей
  - `Orders/Audit`: убрать ложные фильтры по email и привести фильтры к реальному backend-контракту
- Во вторую очередь:
  - `Audit`: унифицировать action taxonomy и сделать все важные admin-события реально находимыми
  - `Teams`: добавить полноценный UI для CRUD команд, если API остаётся частью референса
- Позже:
  - усилить интеграционные/e2e smoke-тесты вокруг `Admin`
  - зачистить security/ops-долг вроде логирования хэшей и несинхронных контрактов

## Readiness Verdict
- Проект можно использовать как референс только условно: публичный контур и базовый dev-стек в целом поднимаются, но `Admin` сейчас не является надёжной базой для дальнейшей доработки без предварительной стабилизации.
- Главная причина: ключевые admin-сценарии `orders`, `styles`, `audit` и `teams` расходятся между UI, API, DTO validation и seed-данными.
- Практический вывод: перед планированием новых функций сначала нужно выровнять существующие контракты `Admin`, иначе следующая итерация будет строиться поверх уже сломанных или вводящих в заблуждение сценариев.
