# Шаг 2. Общий admin-shell и пустая песочница нового интерфейса

## 1. Смысл шага
Это эквивалент `общего каркаса` для уже существующего проекта. На этом шаге мы не доделываем все бизнес-сценарии, а создаём устойчивый reusable слой для всех admin-страниц:
- единый layout;
- единые блоки фильтрации;
- единые блоки списков;
- единые row-actions;
- единый способ подключать новые вкладки без разрастания одного файла.

## 2. Цель шага
- [ ] Создать общий UI-каркас `Admin`, одинаково применимый к `Заказам` и `Данным`.
- [ ] Подготовить лёгкую `sandbox`-структуру новых табов `Data`, не реализуя сразу всю бизнес-логику каждого tab.
- [ ] Подготовить точку расширения для `Users`, `Admins`, `Working Groups`.
- [ ] Уменьшить связанность и размер будущих PR в последующих шагах.

## 3. Главный архитектурный принцип шага
Не строить абстрактную платформу-конструктор, а собрать минимально достаточный набор компонентов:
- reusable, но не over-engineered;
- понятный по ответственности;
- удобный для существующей кодовой базы.

Это лучший вариант по `KISS` и `YAGNI`, потому что:
- текущая админка небольшая;
- сущности различаются по структуре;
- слишком ранняя meta-конфигурация усложнит развитие сильнее, чем поможет.

## 4. Что должно получиться после шага

### 4.1. Визуально
- [ ] `Orders` и `Data` выглядят как части одной системы.
- [ ] У обоих есть одинаковая page skeleton-структура:
  - page header;
  - admin subnav;
  - filter/search panel;
  - list/result block;
  - empty/loading/error states.

### 4.2. Архитектурно
- [ ] `AdminDashboard.tsx` перестаёт быть уникальным визуальным исключением.
- [ ] `AdminData.tsx` перестаёт быть монолитом, в который потом будет страшно добавлять новые вкладки.
- [ ] Появляется reusable слой admin UI primitives.

## 5. Разбор текущей архитектуры и выводы

### 5.1. Что уже можно переиспользовать
- [ ] [website/src/components/admin/AdminSection.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminSection.tsx:1)
- [ ] [website/src/components/admin/AdminField.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminField.tsx:1)
- [ ] [website/src/components/admin/AdminTable.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminTable.tsx:1)
- [ ] [website/src/components/admin/AdminPagination.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminPagination.tsx:1)

### 5.2. Что сейчас мешает
- [ ] [website/src/components/admin/AdminTable.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/components/admin/AdminTable.tsx:1) слишком примитивен и не описывает states/actions/layout contract.
- [ ] [website/src/pages/AdminData.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminData.tsx:92) одновременно является:
  - page container;
  - state manager;
  - tab orchestrator;
  - form renderer;
  - list renderer;
  - CRUD handler.
- [ ] [website/src/pages/AdminDashboard.tsx](/home/ra-naun/Desktop/projects/kat/access/baguette_workshop_site/website/src/pages/AdminDashboard.tsx:34) визуально похож на отдельную страницу, а не на часть единой admin design system.

## 6. Архитектурные решения шага

### 6.1. Новый слой frontend-компонентов
Рекомендуемый минимальный набор:
- [ ] `AdminPageLayout`
- [ ] `AdminFilterPanel`
- [ ] `AdminListBlock`
- [ ] `AdminListState`
- [ ] `AdminRowActions`
- [ ] `AdminTabBar`

### 6.2. Что делать с существующими компонентами
- [ ] `AdminShell` оставить как верхнеуровневую обёртку для страницы.
- [ ] `AdminSection` использовать как section-wrapper или поглотить его роль новым `AdminListBlock`.
- [ ] `AdminTable` не превращать в гигантский универсальный data-grid; оставить лёгким и понятным.
- [ ] `AdminField` сохранить как базу для форменных примитивов.

### 6.3. Что делать с `AdminData`
- [ ] Разделить page-shell и tab-content.
- [ ] На этом шаге не переносить весь CRUD, а только заложить структуру:
  - контейнер страницы;
  - tab registry;
  - общие props для tab-компонентов;
  - пустые/временные stub-компоненты для будущих вкладок.

## 7. Подробный план выполнения

### 7.1. Визуальный контракт
- [ ] Зафиксировать единый page spacing и container rules
- [ ] Зафиксировать единый filter panel contract:
  - фон;
  - сетка;
  - поведение на мобильных;
  - alignment кнопок
- [ ] Зафиксировать единый list block contract:
  - header;
  - body;
  - empty state;
  - action area

### 7.2. Новые frontend-компоненты
- [ ] Создать папку для переиспользуемых admin-shell primitives, например:
  - `website/src/components/admin/layout/`
  - или расширить текущий `components/admin/`, но с нормальной сегментацией
- [ ] Добавить:
  - `AdminFilterPanel.tsx`
  - `AdminListBlock.tsx`
  - `AdminListState.tsx`
  - `AdminRowActions.tsx`
  - `AdminTabBar.tsx`
- [ ] Добавить соответствующие CSS-модули/файлы, не смешивая всё в одном `AdminData.css`

### 7.3. Refactor `AdminDashboard`
- [ ] Перевести страницу заказов на новый shell
- [ ] Сохранить текущую order-specific card/list модель, если она удобнее таблицы
- [ ] Но визуально подчинить её общему admin-layout
- [ ] Свести inline-элементы действий к единому `AdminRowActions`

### 7.4. Refactor `AdminData` без полной бизнес-логики
- [ ] Оставить в `AdminData.tsx`:
  - page shell
  - activeTab state
  - загрузку tab metadata
  - orchestration
- [ ] Вынести содержимое вкладок в отдельные компоненты:
  - `AdminCatalogTab`
  - `AdminMaterialsTab`
  - `AdminStylesTab`
  - `AdminServicesTab`
  - `AdminUsersTab` (пока stub или minimal shell)
  - `AdminAdminsTab` (пока stub или minimal shell)
  - `AdminTeamsTab` (пока stub или minimal shell)
- [ ] На этом шаге новые табы могут отображать:
  - title;
  - filter block skeleton;
  - empty state;
  - список-заглушку;
  если backend-логика ещё не подключена

### 7.5. CSS и дизайн-система
- [ ] Разделить responsibility CSS:
  - `AdminShell.css` = page-level/navigation
  - `AdminTable.css` = generic list/table visuals
  - новый `AdminLayout.css` = filter/list shell
  - `AdminData.css` = только page-specific overrides
- [ ] Не копировать одинаковые grid/flex правила между `Orders` и `Data`

## 8. Файлы, которые нужно будет править

### 8.1. Существующие
- `website/src/components/admin/AdminShell.tsx`
- `website/src/components/admin/AdminShell.css`
- `website/src/components/admin/AdminSection.tsx`
- `website/src/components/admin/AdminTable.tsx`
- `website/src/components/admin/AdminTable.css`
- `website/src/components/admin/AdminField.tsx`
- `website/src/pages/AdminDashboard.tsx`
- `website/src/pages/AdminDashboard.css`
- `website/src/pages/AdminData.tsx`
- `website/src/pages/AdminData.css`

### 8.2. Новые
- `website/src/components/admin/AdminFilterPanel.tsx`
- `website/src/components/admin/AdminListBlock.tsx`
- `website/src/components/admin/AdminListState.tsx`
- `website/src/components/admin/AdminRowActions.tsx`
- `website/src/components/admin/AdminTabBar.tsx`
- `website/src/components/admin/...css`
- `website/src/components/admin/tabs/AdminCatalogTab.tsx`
- `website/src/components/admin/tabs/AdminMaterialsTab.tsx`
- `website/src/components/admin/tabs/AdminStylesTab.tsx`
- `website/src/components/admin/tabs/AdminServicesTab.tsx`
- `website/src/components/admin/tabs/AdminUsersTab.tsx`
- `website/src/components/admin/tabs/AdminAdminsTab.tsx`
- `website/src/components/admin/tabs/AdminTeamsTab.tsx`

## 9. Senior refactoring guidance

### 9.1. Как лучше организовать `AdminData`
Лучший вариант:
- page-level container в `AdminData.tsx`
- табы в отдельных компонентах
- shared hooks и shared UI primitives вынесены отдельно

Почему это лучше:
- не разрастается один файл;
- каждая вкладка имеет собственную ответственность;
- проще тестировать;
- проще вводить новые вкладки без регрессии в старых.

### 9.2. Как не надо делать
- не держать все табы в одном giant switch на 1000+ строк;
- не прокидывать в каждый tab весь state страницы;
- не строить schema-driven engine с конфигом на все сущности уже сейчас.

## 10. Риски шага
- [ ] Риск: сделать красивый shell, но не оставить понятных extension points для новых табов.
- [ ] Риск: вынести слишком много абстракций и усложнить обычный CRUD.
- [ ] Риск: смешать новый admin-shell с legacy CSS, не разделив ответственность.

## 11. Артефакты результата
- [ ] Единый admin-shell существует.
- [ ] `Orders` визуально и структурно совместимы с `Data`.
- [ ] `AdminData` разделён на page shell и tab components.
- [ ] Новые будущие вкладки уже имеют место в структуре, даже если часть из них пока пустые.

## 12. Проверки после выполнения шага
- [ ] Проверить `/admin/orders`
- [ ] Проверить `/admin/data`
- [ ] Проверить переключение всех tab buttons
- [ ] Проверить мобильную ширину и desktop layout
- [ ] Убедиться, что loading/empty/error states выглядят единообразно

## 13. Финальная проверка, что ничего не забыто
- [ ] Общий page skeleton создан
- [ ] Общий filter panel создан
- [ ] Общий list block создан
- [ ] Общий row-actions pattern создан
- [ ] `AdminData` перестал быть монолитом
- [ ] Новые табы имеют подготовленную структуру
- [ ] CSS-разделение ответственности соблюдено
- [ ] Нет преждевременной over-engineering абстракции
