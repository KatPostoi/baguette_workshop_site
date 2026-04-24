# Шаг 3. Приведение раздела `Заказы` к итоговому контракту

## 1. Цель шага
- [ ] Сделать `Orders` эталонной admin-страницей с финальным layout-контрактом.
- [ ] Исправить order-specific API и UX-проблемы, найденные в ревью.
- [ ] Подготовить устойчивую модель действий над заказами до начала расширения `Data`.

## 2. Почему именно `Orders` идут раньше `Data`
- `Orders` уже существуют как отдельная страница и содержат наиболее чувствительную бизнес-логику.
- Здесь уже подтверждены реальные runtime-баги.
- Если сначала строить сложный `Data`, а потом возвращаться к `Orders`, общий admin-shell окажется теоретическим, а не проверенным на живом сценарии.

## 3. Что должно получиться после шага
- [ ] `Orders` используют общий admin layout.
- [ ] Фильтры и список визуально и архитектурно унифицированы.
- [ ] Назначение команды работает через согласованный backend contract.
- [ ] Командные фильтры работают на корректных ID.
- [ ] Страница не вводит в заблуждение по фильтрам пользователя и командам.

## 4. Текущая архитектура и проблемы

### 4.1. Frontend
- [ ] `AdminDashboard.tsx` совмещает:
  - фильтрацию;
  - загрузку заказов;
  - массовые действия;
  - order actions;
  - timeline handling;
  - модальное окно деталей.
- [ ] `website/src/api/orders.ts` смешивает order-операции и team-операции.
- [ ] UI обещает фильтр `Пользователь (id/email)`, но backend сейчас реально принимает UUID.

### 4.2. Backend
- [ ] `AdminOrdersController` не имеет `PATCH :id/team`.
- [ ] `AdminOrderFilterDto` требует UUID для `userId` и `teamId`.
- [ ] Seed-команды конфликтуют с этой валидацией.
- [ ] Order actions расположены в двух разных route-префиксах.

## 5. Архитектурные решения шага

### 5.1. Канонический контракт для order actions
- [ ] Все admin-only операции по заказам должны жить под `/admin/orders/*`.
- [ ] `assignTeam` переносим или дублируем на admin route, а frontend использует только admin-prefixed endpoint.
- [ ] Публичный `/orders/*` должен содержать только пользовательские сценарии или neutral read scenarios.

### 5.2. Команды и фильтры
- [ ] Для команд используем единый формат UUID.
- [ ] Во frontend не показываем пользователю фильтр, который backend не поддерживает честно.
- [ ] Лучший вариант:
  - `userId` фильтр либо честно подписать как `UUID пользователя`,
  - либо расширить backend на поиск по email в отдельном поле/endpoint.
- [ ] На этом шаге допустим компромисс: привести подписи UI к реальному контракту, а поддержку поиска по email перенести в backlog.

### 5.3. Row-actions для заказов
- [ ] Для заказов нельзя делать hard delete.
- [ ] Рекомендуемый набор действий на этом шаге:
  - `Редактировать` = открыть modal/drawer с изменением статуса, команды и служебных полей
  - `Удалить` = не реализовывать как физическое удаление; если нужен UX-эквивалент, то проектировать отдельно как archive/hide later
- [ ] Если заказчик потребует буквальную кнопку `Удалить`, сначала нужно согласовать безопасную бизнес-семантику.

## 6. Подробный план выполнения

### 6.1. Frontend refactor
- [ ] Выделить order page sections:
  - `OrdersFilterPanel`
  - `OrdersList`
  - `OrdersBulkActions`
  - `OrderEditActions`
- [ ] Перевести верхний filter block на общий `AdminFilterPanel`
- [ ] Привести список к общему `AdminListBlock`
- [ ] Вынести row actions в единый `AdminRowActions`, сохранив order-specific controls внутри него
- [ ] Привести подписи фильтров к реальному поведению backend

### 6.2. Frontend API cleanup
- [ ] Вынести `fetchTeams` и `assignTeam` в `website/src/api/teams.ts`
- [ ] Оставить в `orders.ts`:
  - `fetchAdminOrders`
  - `updateOrderStatus`
  - `bulkUpdateOrderStatus`
  - `fetchOrderTimeline`
  - order read/create/pay/cancel
- [ ] Проверить, что типы `Order`, `Team`, `OrderTimeline` остаются единообразными

### 6.3. Backend refactor
- [ ] Добавить в `AdminOrdersController`:
  - `PATCH /admin/orders/:id/team`
- [ ] При необходимости оставить старый `/orders/:id/team` временно, но пометить его как legacy path
- [ ] Выровнять `OrdersService.assignTeam` под canonical admin contract
- [ ] Исправить seed IDs команд на реальные UUID
- [ ] Проверить фильтры `teamId` и `userId`

### 6.4. UX и states
- [ ] Добавить единый `empty state`, если заказы не найдены
- [ ] Добавить единый `error state`, а не только короткий `Не удалось загрузить заказы`
- [ ] Проверить `loading` для:
  - initial page load
  - refresh
  - bulk actions
  - single row actions

## 7. Файлы, которые нужно будет править

### 7.1. Frontend
- `website/src/pages/AdminDashboard.tsx`
- `website/src/pages/AdminDashboard.css`
- `website/src/api/orders.ts`
- `website/src/api/teams.ts` (новый)
- `website/src/components/orders/OrderCard.tsx`
- `website/src/components/orders/OrderDetailsModal.tsx`
- `website/src/components/admin/*` shared primitives

### 7.2. Backend
- `backend/app/src/modules/orders/admin-orders.controller.ts`
- `backend/app/src/modules/orders/orders.controller.ts`
- `backend/app/src/modules/orders/orders.service.ts`
- `backend/app/src/modules/orders/dto/assign-team.dto.ts`
- `backend/app/src/modules/orders/dto/admin-order-filter.dto.ts`
- `backend/app/prisma/seed.ts`

## 8. Refactoring guidance как сеньор

### 8.1. Как лучше разделить код `AdminDashboard`
Лучший вариант:
- page component держит orchestration state;
- list component отвечает за рендер позиций;
- row-actions component отвечает за кнопки/селекты действий;
- API side-effects инкапсулируются в небольших handlers/hooks.

Почему это лучше:
- меньше cognitive load;
- меньше риск сломать bulk-actions при изменении фильтров;
- легче покрывать сценарии ручными и автоматическими проверками.

### 8.2. Чего не делать
- не превращать `Orders` в generic table, если карточки лучше отражают бизнес-смысл;
- не смешивать фильтры, формы и модалку в одном giant JSX block;
- не вводить искусственную delete-логику для заказов без отдельного lifecycle design.

## 9. Дополнительные улучшения логики
- [ ] Добавить debounce для текстового фильтра по пользователю, если он останется live-search
- [ ] Ограничить доступные статусы на UI в зависимости от текущего статуса, а не показывать все всегда
- [ ] Добавить disabled-state для action controls во время запроса
- [ ] Добавить более явный feedback после team assignment/status update

## 10. Риски шага
- [ ] Риск: исправить маршрут, но оставить старые вызовы во frontend
- [ ] Риск: обновить seed команд, но забыть пересобрать связанные тестовые данные
- [ ] Риск: привести layout к общему виду, но потерять удобство order-specific UI

## 11. Артефакты результата
- [ ] `Orders` работают как стабильная admin-страница
- [ ] Команды в заказах работают через согласованный API
- [ ] Фильтры соответствуют реальным backend-контрактам
- [ ] Страница готова служить эталоном для дальнейших admin-экранов

## 12. Проверки после выполнения шага
- [ ] `GET /admin/orders`
- [ ] фильтр по статусу
- [ ] фильтр по команде
- [ ] timeline
- [ ] update status
- [ ] bulk status update
- [ ] assign team

## 13. Финальная проверка, что ничего не забыто
- [ ] canonical route для team assignment внедрён
- [ ] `teams.ts` отделён от `orders.ts`
- [ ] layout `Orders` выровнен с admin-shell
- [ ] фильтры и состояния приведены к общему контракту
- [ ] team UUID conflict устранён
- [ ] delete policy для orders не нарушает безопасность данных
