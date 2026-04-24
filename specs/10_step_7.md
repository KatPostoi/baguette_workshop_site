# Шаг 7. Финальная стабилизация, зачистка и контроль качества

## 1. Цель шага
- [ ] Довести весь обновлённый `Admin` до состояния, пригодного для дальнейшей разработки без накопления скрытого долга.
- [ ] Удалить остаточный legacy-код.
- [ ] Зафиксировать минимальный набор smoke-checks и quality gates.

## 2. Почему нужен отдельный финальный шаг
Без него проект формально будет “работать”, но останется:
- мёртвый код;
- несогласованные naming conventions;
- разрозненные API-клиенты;
- неочевидные сценарии регрессии;
- спецификация без закреплённого quality baseline.

Финальный шаг нужен, чтобы не оставлять систему в полу-рефакторенном состоянии.

## 3. Что должно получиться после шага
- [ ] frontend-admin очищен от legacy `Audit` и временных заглушек
- [ ] новые вкладки интегрированы в общую систему без хаотичных исключений
- [ ] naming, DTO, API modules и UI patterns согласованы
- [ ] есть минимальный список regression/smoke-checks

## 4. Подробный план выполнения

### 4.1. Frontend cleanup
- [ ] Удалить неиспользуемые admin-компоненты, если они остались после рефакторинга
- [ ] Удалить dead CSS и остаточные legacy selectors
- [ ] Проверить, что `AdminData` не содержит временных stub-компонентов или TODO-заглушек
- [ ] Проверить consistency:
  - labels
  - buttons
  - headings
  - empty states
  - error messages

### 4.2. Backend cleanup
- [ ] Проверить consistency route naming:
  - admin-only действия под `/admin/*`
  - user-facing действия под публичными route prefixes
- [ ] Убедиться, что DTO и validation соответствуют реальным типам данных
- [ ] Удалить временные compatibility paths, если они больше не нужны
- [ ] Удалить опасные debug logs вроде `passwordHash`

### 4.3. API layer cleanup
- [ ] Проверить, что frontend API разложен по сущностям:
  - `orders.ts`
  - `teams.ts`
  - `users.ts`
  - `catalog.ts`
  - `materials.ts`
  - `styles.ts`
  - `services.ts`
- [ ] Проверить, что типы не дублируются и не расходятся

### 4.4. UX consistency
- [ ] Проверить, что во всех списках есть одинаковый pattern:
  - filter/search
  - list
  - edit/delete
  - confirm destructive action
- [ ] Проверить адаптивность на mobile/desktop
- [ ] Проверить визуальную цельность `Orders` и `Data`

### 4.5. Проверки качества
- [ ] Статические проверки:
  - `website`: lint/typecheck
  - `backend/app`: lint/typecheck
- [ ] Runtime smoke:
  - login admin
  - `/admin/orders`
  - `/admin/data`
  - each tab open
  - edit one entity in each tab
  - delete/deactivate one entity in each safe tab
- [ ] Проверить docker `dev` сценарий
- [ ] По возможности повторно проверить docker `test` сценарий в стабильной сети

## 5. Файлы и зоны, которые нужно проверить особенно тщательно

### 5.1. Frontend
- `website/src/App.tsx`
- `website/src/components/admin/*`
- `website/src/pages/AdminDashboard.tsx`
- `website/src/pages/AdminData.tsx`
- `website/src/api/*`
- `website/src/state/permissions.ts`

### 5.2. Backend
- `backend/app/src/modules/orders/*`
- `backend/app/src/modules/users/*`
- `backend/app/src/modules/teams/*`
- `backend/app/src/modules/styles/*`
- `backend/app/src/modules/catalog/*`
- `backend/app/src/modules/materials/*`
- `backend/app/src/modules/service-items/*`
- `backend/app/src/modules/auth/*`
- `backend/app/prisma/schema.prisma`
- `backend/app/prisma/seed.ts`

## 6. Senior refactoring guidance

### 6.1. Что особенно важно проверить
- нет ли новых god-components после декомпозиции
- не появились ли почти одинаковые hooks/components с разными именами
- не размазаны ли delete semantics между frontend и backend
- не остались ли legacy contracts, которые фронт больше не использует

### 6.2. Какие улучшения стоит сделать дополнительно
- [ ] Вынести общие action names/status/role constants в shared layer или хотя бы единые frontend/backend константы
- [ ] Подумать о smoke-test harness для admin routes
- [ ] Подумать о lightweight story/demo fixtures для admin shared components
- [ ] Подумать о server-side audit для delete/deactivate операций пользователей и команд

## 7. Риски шага
- [ ] Риск: после завершения основных задач финальная зачистка будет пропущена как “необязательная”
- [ ] Риск: временные compatibility-контракты останутся навсегда
- [ ] Риск: UI будет единообразным визуально, но нелогичным в текстах и states

## 8. Артефакты результата
- [ ] Все step-задачи собраны в единый, чистый и консистентный `Admin`
- [ ] Нет остаточного frontend dead code, связанного с удалёнными разделами
- [ ] Нет опасных backend debug-patterns
- [ ] Есть минимальный regression baseline для следующих этапов разработки

## 9. Definition of Done для финального шага
- [ ] `Audit` удалён из frontend полностью
- [ ] `Orders` и `Data` визуально и структурно единообразны
- [ ] `Data` содержит:
  - `Каталог`
  - `Материалы`
  - `Стили`
  - `Услуги`
  - `Пользователи`
  - `Администраторы`
  - `Рабочие группы`
- [ ] В каждой позиции списка есть `Редактировать` и безопасный `Удалить`
- [ ] Delete semantics не нарушают ссылочную целостность
- [ ] Статические проверки проходят
- [ ] Основные runtime smoke-checks проходят

## 10. Финальная проверка, что ничего не забыто
- [ ] dead code удалён
- [ ] naming выровнен
- [ ] DTO/contracts выровнены
- [ ] lint/typecheck проходят
- [ ] smoke checks зафиксированы
- [ ] admin architecture пригодна для следующей итерации доработок
