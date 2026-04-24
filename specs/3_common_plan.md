# Общий план переработки раздела `Admin`

## 1. Цель изменений
- [ ] Удалить раздел `Аудит` из frontend-части `Админки`.
- [ ] Оставить в `Админке` только два верхнеуровневых раздела: `Заказы` и `Данные`.
- [ ] Привести `Заказы` и `Данные` к единому визуальному и архитектурному паттерну:
  - блок фильтрации и поиска;
  - блок списка позиций;
  - единые состояния `loading / empty / error`;
  - единый набор row-actions, минимум `Редактировать` и `Удалить`.
- [ ] В `Данные` оставить и стабилизировать вкладки:
  - `Каталог`
  - `Материалы`
  - `Стили`
  - `Услуги`
- [ ] В `Данные` добавить новые вкладки:
  - `Пользователи`
  - `Администраторы`
  - `Рабочие группы`
- [ ] Подготовить архитектуру так, чтобы данные для этих вкладок поступали через backend API, который работает с БД, а frontend не зависел от структуры базы напрямую.

## 2. Рекомендуемый архитектурный подход

### 2.1. Что делаем
- [ ] Упрощаем информационную архитектуру `Admin`: только `Заказы` и `Данные`.
- [ ] Сохраняем domain-driven разделение:
  - `Заказы` остаются отдельной страницей с order-specific логикой;
  - `Данные` становятся контейнером для табов со справочниками и сущностями.
- [ ] Выносим общие admin-примитивы в переиспользуемые компоненты, но не строим чрезмерно универсальный фреймворк поверх админки.
- [ ] Разбиваем текущий монолитный `AdminData.tsx` на отдельные таб-компоненты с чёткой ответственностью.

### 2.2. Что не делаем
- [ ] Не делаем прямой импорт данных из БД во frontend.
- [ ] Не создаём отдельную сущность `Администраторы` в БД, если текущая модель `User + role=ADMIN` уже это покрывает.
- [ ] Не создаём отдельную сущность `Рабочие группы`, если её уже покрывает текущая модель `Team`.
- [ ] Не строим абстрактный универсальный CRUD-engine на все случаи жизни.
- [ ] Не трогаем backend audit-модуль на первом цикле, если задача сейчас состоит именно в удалении audit-раздела из frontend admin UI.

### 2.3. Почему это лучший вариант
- `SOLID`:
  - `AdminData.tsx` сейчас перегружен ответственностями; разделение по табам и API-модулям уменьшит связанность.
  - `Users`, `Admins`, `Teams` лучше описывать через существующие domain-сущности, а не плодить новые.
- `DRY`:
  - общий filter/list shell, общие action-кнопки, общие состояния и общие table/list-обёртки должны переиспользоваться.
- `KISS`:
  - две страницы верхнего уровня проще поддерживать, чем три;
  - `Администраторы` как фильтр по роли лучше, чем новая таблица/новая доменная модель.
- `YAGNI`:
  - не нужно сразу создавать сложный meta-config-driven admin framework;
  - не нужно удалять backend audit, если задача пока только убрать его из UI и маршрутов.

## 3. Разбор текущей архитектуры

### 3.1. Frontend
- [ ] В [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:67) сейчас есть три admin-маршрута: `orders`, `audit`, `data`.
- [ ] В [website/src/components/admin/AdminShell.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.tsx:18) жёстко зашита поднавигация из трёх ссылок.
- [ ] [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:34) уже близок к нужному виду:
  - есть filter block;
  - есть список заказов;
  - есть действия по позициям.
- [ ] [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:92) сейчас слишком крупный и совмещает:
  - табы;
  - загрузку данных;
  - фильтрацию;
  - формы редактирования;
  - таблицы;
  - действия удаления;
  - логику пользователей.
- [ ] [website/src/components/admin/AdminTable.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminTable.tsx:1) и [website/src/components/admin/AdminSection.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminSection.tsx:1) слишком базовые; их стоит либо аккуратно расширить, либо обернуть новыми специализированными admin-компонентами.
- [ ] [website/src/components/admin/AdminTable.css](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminTable.css:1) уже содержит базу для общего списка позиций, но требует стандартизации row-layout и actions.

### 3.2. Backend
- [ ] Для `Users` уже есть list/search endpoint: [backend/app/src/modules/users/admin-users.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/users/admin-users.controller.ts:1).
- [ ] Для `Teams` уже есть list/create/update endpoint: [backend/app/src/modules/teams/teams.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/teams/teams.controller.ts:17).
- [ ] Для `Users/Admins` сейчас нет полноценного безопасного admin CRUD.
- [ ] Для `Teams` нет явного delete API, но в модели уже есть `active`, что удобно для soft delete.
- [ ] По результатам ревью есть обязательные технические долги, которые нужно заложить в план до расширения `Admin`:
  - конфликт frontend/backend маршрута назначения команды;
  - конфликт `Team` seed IDs и UUID-валидации;
  - конфликт `FrameStyle.id` и `ParseUUIDPipe`.

### 3.3. База данных
- [ ] `User` сейчас не имеет `isActive/deletedAt`: [backend/app/prisma/schema.prisma](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/schema.prisma:122)
- [ ] `Team` уже имеет `active`: [backend/app/prisma/schema.prisma](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/prisma/schema.prisma:238)
- [ ] Для `Users/Admins` физическое удаление рискованно, потому что пользователь участвует в заказах, аудитах, истории статусов и связанных данных.
- [ ] Для `Рабочих групп` безопаснее использовать soft delete через `active=false`, чем hard delete.

## 4. Целевая структура `Admin`

### 4.1. Верхний уровень
- [ ] `Admin -> Заказы`
- [ ] `Admin -> Данные`

### 4.2. Раздел `Заказы`
- [ ] Сохраняем как отдельную страницу.
- [ ] Приводим к единому layout:
  - верхний блок фильтрации;
  - ниже единый list-block;
  - унифицированные row-actions;
  - одинаковые отступы, контейнеры и состояния с `Данными`.
- [ ] Заказы не нужно насильно превращать в обычную таблицу, если richer row/card остаётся удобнее.
- [ ] Требование по общему виду трактуем как общий page skeleton и единая система блоков, а не как идентичный markup для всех сущностей.

### 4.3. Раздел `Данные`
- [ ] Делаем container-page с табами.
- [ ] Для каждого таба задаём одинаковую композицию:
  - `Filter/Search block`
  - `List block`
  - `Edit/Delete` actions у каждой строки
  - отдельный edit flow через modal/drawer/form-panel, а не через огромную постоянно открытую форму вверху страницы
- [ ] Набор вкладок:
  - `Каталог`
  - `Материалы`
  - `Стили`
  - `Услуги`
  - `Пользователи`
  - `Администраторы`
  - `Рабочие группы`

### 4.4. Семантика новых вкладок
- [ ] `Пользователи` = `User` c фильтром `role=CUSTOMER`
- [ ] `Администраторы` = `User` c фильтром `role=ADMIN`
- [ ] `Рабочие группы` = `Team`
- [ ] Не создаём для них новые сущности без острой необходимости.

## 5. Обязательные продуктовые и технические решения

### 5.1. Удаление `Аудита`
- [ ] Удалить admin-route `/admin/audit` из frontend.
- [ ] Удалить ссылку `Аудит` из admin-subnav.
- [ ] Удалить frontend-страницу `AdminAudit` и завязанный на неё API-клиент, если он больше нигде не нужен.
- [ ] Backend `audit` на этом шаге не удалять, если он не мешает остальной системе.

### 5.2. Общий вид `Заказов` и `Данных`
- [ ] Зафиксировать общий шаблон страницы admin-раздела:
  - page title;
  - subnav;
  - filter/search block;
  - list block;
  - loading/empty/error;
  - row actions.
- [ ] Вынести общий visual contract в переиспользуемые admin-компоненты и CSS-токены.

### 5.3. Кнопки `Редактировать` и `Удалить`
- [ ] У каждой позиции списка обязателен row-actions блок.
- [ ] Для `Catalog / Materials / Styles / Services` допускается реальный delete, если бизнес-ограничения позволяют.
- [ ] Для `Рабочих групп` delete лучше реализовать как деактивацию через `active=false`, сохранив UX-кнопку `Удалить` только если это согласовано как soft delete.
- [ ] Для `Users / Admins` рекомендован soft delete или deactivate/archive, а не hard delete.

### 5.4. Источник данных
- [ ] Frontend получает данные только через backend API.
- [ ] Backend отвечает за чтение/запись в PostgreSQL через Prisma.
- [ ] В плане не закладывать прямую интеграцию UI с БД.

## 6. План рефакторинга по слоям

### 6.1. Frontend: что править

#### 6.1.1. Навигация и маршрутизация
- [ ] [website/src/App.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/App.tsx:67)
  - удалить route `/admin/audit`
  - оставить только `/admin/orders` и `/admin/data`
  - проверить redirect `/admin -> /admin/orders`
- [ ] [website/src/components/admin/AdminShell.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.tsx:18)
  - удалить ссылку `Аудит`
  - зафиксировать итоговую поднавигацию
- [ ] [website/src/components/admin/AdminShell.css](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminShell.css:1)
  - выровнять subnav под финальную двухсекционную структуру

#### 6.1.2. Общие admin-компоненты
- [ ] Создать общий набор лёгких компонентов:
  - `AdminFilterPanel`
  - `AdminListBlock`
  - `AdminRowActions`
  - при необходимости `AdminTabBar`
- [ ] Не перегружать [AdminTable.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminTable.tsx:1) десятками пропсов; лучше добавить тонкие обёртки вокруг него.
- [ ] Унифицировать CSS для:
  - filters;
  - row-actions;
  - таблиц/списков;
  - empty/error/loading states.

#### 6.1.3. `AdminDashboard`
- [ ] [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:34)
  - привести к итоговому layout-контракту;
  - отделить filter-toolbar от list-block;
  - подготовить структуру для переиспользуемых action-компонентов;
  - исправить завязки на команды и order-actions по итогам ревью.

#### 6.1.4. `AdminData`
- [ ] [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:92)
  - перестать держать всю admin-data логику в одном файле;
  - оставить page-container и orchestration state;
  - вынести табы в отдельные компоненты.
- [ ] Рекомендуемая декомпозиция:
  - `AdminCatalogTab`
  - `AdminMaterialsTab`
  - `AdminStylesTab`
  - `AdminServicesTab`
  - `AdminUsersTab`
  - `AdminAdminsTab`
  - `AdminTeamsTab`
- [ ] Для новых табов сразу закладывать общий list/filter shell, даже если часть операций сначала будет подключаться постепенно.

#### 6.1.5. API-клиенты
- [ ] Упростить ответственность API-модулей:
  - `orders.ts` должен обслуживать только заказы;
  - работу с командами лучше вынести в отдельный `teams.ts`;
  - admin-users операции не смешивать с пользовательским self-profile API без необходимости.
- [ ] Удалить `audit.ts` из frontend, если после удаления раздела он нигде не используется.

### 6.2. Backend: что править

#### 6.2.1. Users / Admins
- [ ] Расширить admin-user API:
  - list/search уже есть;
  - добавить update endpoint;
  - определить безопасную стратегию delete/deactivate.
- [ ] Рекомендуемый вариант:
  - не делать hard delete пользователей;
  - добавить `isActive` или `deletedAt` для `User`;
  - login/search/admin lists учитывать это поле.
- [ ] Использовать один backend-модуль пользователей для двух frontend-вкладок:
  - `Users`
  - `Admins`

#### 6.2.2. Teams / Working Groups
- [ ] Исправить конфликт с UUID и seed-данными.
- [ ] Оставить `Team` как backend-источник для `Рабочих групп`.
- [ ] Добавить безопасный delete-flow:
  - предпочтительно soft delete через `active=false`
  - list endpoint должен уметь возвращать активные/неактивные группы при необходимости

#### 6.2.3. Existing Data entities
- [ ] Привести в рабочее состояние update/delete для `Styles`.
- [ ] Убедиться, что `Catalog / Materials / Services` соответствуют новому UI-контракту и дают стабильный CRUD под новые таб-компоненты.

### 6.3. Database / Prisma
- [ ] Для `User` оценить миграцию на `isActive` или `deletedAt`.
- [ ] Для `Team` использовать уже существующее `active`, не изобретая вторую сущность.
- [ ] Перегенерировать seed, если меняются UUID команд.
- [ ] Не добавлять новые таблицы для `Admins` и `Working Groups`, если их уже покрывают `User.role` и `Team`.

## 7. Предлагаемая последовательность работ

> Так как проект уже существует, шаги декомпозированы не как greenfield-инициализация, а как аккуратный рефакторинг и расширение действующей админки.

### Шаг 1. Зафиксировать финальную admin-архитектуру и зачистить обязательные противоречия
- [ ] Удалить `Audit` из frontend-навигации и маршрутов.
- [ ] Зафиксировать итоговую информационную архитектуру `Admin`.
- [ ] Выбрать стратегию delete для `Users/Admins/Teams`.
- [ ] Зафиксировать entity mapping:
  - `Users = User(CUSTOMER)`
  - `Admins = User(ADMIN)`
  - `Working Groups = Team`
- [ ] Учесть обязательные prereq fixes из ревью.

### Шаг 2. Построить общий admin UI-shell
- [ ] Собрать единый page skeleton.
- [ ] Вынести общие filter/list/action primitives.
- [ ] Выровнять CSS и адаптивность.

### Шаг 3. Привести `Orders` к итоговому контракту
- [ ] Нормализовать фильтры и список.
- [ ] Исправить команды, route mismatch и order actions.
- [ ] Подготовить orders page как эталон общего admin-layout.

### Шаг 4. Разобрать `AdminData` на независимые tab-модули
- [ ] Убрать монолитную страницу.
- [ ] Вынести existing tabs в отдельные компоненты.
- [ ] Перевести редактирование в modal/drawer/form-flow.

### Шаг 5. Добавить вкладки `Пользователи` и `Администраторы`
- [ ] Построить два UI-представления поверх одного backend user-domain.
- [ ] Добавить edit/delete(deactivate) flow.
- [ ] Привести permissions и states к общему стандарту.

### Шаг 6. Добавить вкладку `Рабочие группы`
- [ ] Построить UI на базе `Team`.
- [ ] Добавить фильтр, список, edit/delete actions.
- [ ] Реализовать soft delete / deactivate стратегию.

### Шаг 7. Финальная стабилизация
- [ ] Проверить единообразие UX.
- [ ] Удалить dead code `Audit` во frontend.
- [ ] Довести type safety, DTO, API naming.
- [ ] Прогнать smoke/integration checks.

## 8. Иерархия будущих step-файлов

- [ ] [specs/4_step_1.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/4_step_1.md)
  - финализация admin-архитектуры;
  - удаление `Audit` из frontend;
  - фиксация entity mapping и delete-стратегии;
  - prereq fixes из ревью, без которых нельзя безопасно расширять `Admin`.

- [ ] [specs/5_step_2.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/5_step_2.md)
  - создание общего admin UI-shell;
  - общие filter/list/action компоненты;
  - выравнивание CSS и layout-контракта.

- [ ] [specs/6_step_3.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/6_step_3.md)
  - рефакторинг `Orders`;
  - единый list/filter формат;
  - стабилизация order-actions и работы с командами.

- [ ] [specs/7_step_4.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/7_step_4.md)
  - декомпозиция `AdminData`;
  - перенос `Каталог / Материалы / Стили / Услуги` в отдельные tab-компоненты;
  - приведение edit/delete flows к единому виду.

- [ ] [specs/8_step_5.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/8_step_5.md)
  - вкладки `Пользователи` и `Администраторы`;
  - backend support для edit/delete(deactivate);
  - единый UX и permissions.

- [ ] [specs/9_step_6.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/9_step_6.md)
  - вкладка `Рабочие группы`;
  - backend support для edit/delete/deactivate;
  - стабилизация entity lifecycle для `Team`.

- [ ] [specs/10_step_7.md](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/specs/10_step_7.md)
  - финальная чистка;
  - тесты и smoke-checks;
  - удаление dead code;
  - документация и контроль качества.

## 9. Definition of Done для всего эпика
- [ ] Во frontend-admin нет раздела `Аудит`.
- [ ] Верхний уровень `Admin` состоит только из `Заказы` и `Данные`.
- [ ] `Заказы` и `Данные` имеют единый page skeleton.
- [ ] Во всех вкладках `Данные` есть:
  - filter/search block;
  - list block;
  - `Редактировать`;
  - `Удалить`.
- [ ] Вкладки `Пользователи`, `Администраторы`, `Рабочие группы` добавлены.
- [ ] `Пользователи` и `Администраторы` не требуют отдельной БД-сущности.
- [ ] `Рабочие группы` используют `Team`, а не новую сущность.
- [ ] Нет frontend dead code, связанного с audit-страницей.
- [ ] Базовые сценарии проходят без явных runtime-ошибок.

## 10. Риски и меры снижения
- [ ] Риск: попытка сделать слишком универсальную админ-платформу.
  - Мера: использовать только нужные shared primitives, без meta-framework.
- [ ] Риск: опасное hard delete пользователей.
  - Мера: закладывать deactivate/soft delete.
- [ ] Риск: новые вкладки будут формально добавлены, но останутся архитектурно привязаны к монолитному `AdminData.tsx`.
  - Мера: декомпозиция `AdminData` обязательна, а не опциональна.
- [ ] Риск: исправления новых вкладок начнутся до устранения текущих несоответствий contracts/validation.
  - Мера: выполнить prereq fixes на ранних шагах.

## 11. Дополнительные улучшения кода и логики
- [ ] Вынести admin API-операции в более узкие клиентские модули по сущностям.
- [ ] Свести строковые action/status/role constants к единым shared enums или хотя бы единым frontend/backend константам.
- [ ] Добавить confirm-flow и единый destructive-action pattern для удаления.
- [ ] Ввести единый pattern для modal/drawer редактирования вместо giant inline forms.
- [ ] Добавить smoke-проверки admin-маршрутов после каждого крупного шага.

## 12. Финальная контрольная проверка, что ничего не забыто
- [ ] Удаление `Audit` учтено.
- [ ] Верхнеуровневая навигация `Admin` учтена.
- [ ] Общий layout `Orders` и `Data` учтён.
- [ ] Новые вкладки `Users / Admins / Working Groups` учтены.
- [ ] Источник данных через backend API учтён.
- [ ] Единые `Edit/Delete` actions учтены.
- [ ] Refactoring `AdminData` учтён.
- [ ] Backend и Prisma изменения учтены.
- [ ] Риски hard delete и contract mismatch учтены.
- [ ] Декомпозиция на будущие step-файлы учтена.
