# Шаг 5. Вкладки `Пользователи` и `Администраторы`

## 1. Цель шага
- [ ] Добавить в `Data` две новые вкладки:
  - `Пользователи`
  - `Администраторы`
- [ ] Реализовать их поверх одной сущности `User`, без новых таблиц и без дублирования бизнес-логики.
- [ ] Добавить безопасные операции `Редактировать` и `Удалить`.

## 2. Ключевое архитектурное решение
- [ ] `Пользователи` и `Администраторы` — это не разные доменные сущности.
- [ ] Это два представления над одной моделью `User`:
  - `UsersTab` показывает `role=CUSTOMER`
  - `AdminsTab` показывает `role=ADMIN`
- [ ] Backend также не должен разделяться на два разных модуля только ради UI.

Это лучший вариант:
- `SOLID`: один user-domain, разные query/use-case уровни
- `DRY`: один набор DTO/service logic
- `KISS`: меньше сущностей и меньше маршрутов
- `YAGNI`: не нужна таблица `AdminProfile` или отдельный `admins` module

## 3. Текущая архитектура и ограничения
- [ ] Сейчас есть только `GET /admin/users` через [backend/app/src/modules/users/admin-users.controller.ts](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/backend/app/src/modules/users/admin-users.controller.ts:1)
- [ ] Во frontend пользователи уже частично отображаются внутри legacy `AdminData.tsx`, но без отдельного tab-модуля и без edit/delete flow
- [ ] У `User` нет безопасного lifecycle-флага
- [ ] Hard delete опасен, потому что `User` участвует в заказах, audit/history, favorites, basket, customFrames

## 4. Рекомендуемое решение по lifecycle
- [ ] Ввести `isActive Boolean @default(true)` в `User`
- [ ] `Удалить` в UI = deactivate (`isActive=false`)
- [ ] Список должен уметь фильтровать активных/неактивных пользователей
- [ ] Login и публичные user flows должны учитывать `isActive`

Почему не hard delete:
- это разрушит ссылочную целостность и историчность;
- усложнит расследование заказов и действий;
- не оправдано текущей задачей.

Почему `isActive`, а не `deletedAt`:
- проще схема и фильтрация;
- дешевле внедрение;
- достаточно для текущего функционала.

## 5. Подробный план выполнения

### 5.1. Prisma / DB
- [ ] Добавить поле `isActive Boolean @default(true)` в модель `User`
- [ ] Обновить seed, если нужно явно задавать активность
- [ ] Решить, должны ли inactive users попадать в общие выборки по умолчанию

### 5.2. Backend API
- [ ] Расширить `admin-users` модуль:
  - `GET /admin/users?search&role&isActive`
  - `PATCH /admin/users/:id`
  - `DELETE /admin/users/:id` как deactivate
- [ ] Вынести DTO:
  - `AdminUpdateUserDto`
  - `AdminUserFilterDto`
- [ ] Ограничить редактируемые поля:
  - `fullName`
  - `phone`
  - `gender`
  - `role` (осторожно, только если это действительно нужно)
  - `isActive`
- [ ] Не давать admin UI менять `passwordHash` напрямую

### 5.3. Frontend tabs
- [ ] Создать:
  - `AdminUsersTab.tsx`
  - `AdminAdminsTab.tsx`
- [ ] Оба таба должны использовать общий user-domain hook/adapter
- [ ] Различаться должны только:
  - начальный role-filter
  - заголовок
  - возможно набор отображаемых колонок

### 5.4. UI contract
- [ ] В каждой строке:
  - `Редактировать`
  - `Удалить`
- [ ] `Удалить` = deactivate, UI может продолжать подписываться как `Удалить`, но в коде и backend semantics должны быть soft delete
- [ ] Должны быть фильтры:
  - поиск
  - роль
  - активность

## 6. Файлы, которые нужно будет править

### 6.1. Frontend
- `website/src/pages/AdminData.tsx`
- `website/src/api/users.ts`
- `website/src/api/types.ts`
- `website/src/components/admin/tabs/AdminUsersTab.tsx`
- `website/src/components/admin/tabs/AdminAdminsTab.tsx`
- `website/src/components/admin/forms/AdminUserEditForm.tsx` (новый, если форма выносится отдельно)

### 6.2. Backend
- `backend/app/prisma/schema.prisma`
- `backend/app/prisma/seed.ts`
- `backend/app/src/modules/users/admin-users.controller.ts`
- `backend/app/src/modules/users/users.service.ts`
- `backend/app/src/modules/users/users.module.ts`
- `backend/app/src/modules/users/dto/*` (новые admin DTO)
- `backend/app/src/modules/auth/auth.service.ts`

## 7. Senior refactoring guidance

### 7.1. Как лучше организовать backend
Лучший вариант:
- один `UsersService`
- отдельные admin DTO/use-case методы
- role-filter и active-filter работают через query params

Почему это лучше:
- не дублируется логика поиска;
- не появляется второй сервис `AdminsService`;
- role semantics остаются в одном месте.

### 7.2. Как лучше организовать frontend
Лучший вариант:
- shared hook `useAdminUsers` или shared fetch layer
- два thin tab-компонента, а не два независимых набора логики

Почему это лучше:
- меньше дублирования;
- проще менять фильтрацию;
- проще добавлять колонки и действия.

## 8. Дополнительные улучшения кода и логики
- [ ] Ограничить возможность деактивировать самого себя как администратора
- [ ] Запретить удалить последнего активного администратора
- [ ] Добавить визуальную маркировку inactive пользователей
- [ ] Добавить явный фильтр `Активные / Неактивные / Все`

## 9. Риски шага
- [ ] Риск: сделать два разных backend endpoint набора для users/admins и удвоить код
- [ ] Риск: внедрить delete как hard delete
- [ ] Риск: разрешить опасное редактирование роли без ограничений
- [ ] Риск: деактивация пользователя случайно ломает исторические данные

## 10. Артефакты результата
- [ ] Есть вкладка `Пользователи`
- [ ] Есть вкладка `Администраторы`
- [ ] Обе построены поверх одного `User` domain
- [ ] Работают `Редактировать` и безопасный `Удалить`
- [ ] Внедрён безопасный lifecycle `User`

## 11. Проверки после выполнения шага
- [ ] list/search/filter users
- [ ] list/search/filter admins
- [ ] edit user
- [ ] edit admin
- [ ] deactivate user
- [ ] deactivate admin с защитой от опасных сценариев
- [ ] login inactive user блокируется или обрабатывается корректно

## 12. Финальная проверка, что ничего не забыто
- [ ] `Users/Admins` не разнесены в разные сущности
- [ ] `isActive` или эквивалент внедрён
- [ ] `DELETE` не hard delete
- [ ] self-protection и last-admin protection продуманы
- [ ] UI tab structure соответствует общему admin-shell
