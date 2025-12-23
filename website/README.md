# Веб-сайт Baguette Workshop

React + TypeScript + Vite SPA. Взаимодействует с бэкендом только через `/api/*` c JWT авторизацией. Поднимается одной командой вместе с бэкендом/БД: `./start-all.sh dev`.

## Авторизация / сессии
- Access-token (JWT) хранится в `localStorage` или `sessionStorage` в зависимости от чекбокса «Запомнить меня» (`localStorage` для remember-me, `sessionStorage` по умолчанию).
- Refresh-token живёт в httpOnly cookie (`refresh_token`) и обновляется через `/auth/refresh`. Куки выставляет бэкенд при login/register/refresh, фронт его не трогает вручную.
- При истечении access токена фронт вызывает `/auth/refresh`, при неудаче чистит сессию и редиректит на `/login?redirect=...`.
- Защищённые страницы: `/basket`, `/account` (redirect на `/login` c `redirect` query).
- Роли приходят в профиле (`role`), на UI пока нет отдельной админки, но можно скрывать/отключать функциональность по роли.
- Админ-маршруты: `/admin` обёрнут в AdminRoute (role === ADMIN), неадмин получает экран 403, незалогиненный — редирект на `/login`.
- Демо-оплата заказа: в личном кабинете у заказа в статусе `PENDING` есть кнопка «Оплатить» (список и модалка). Клик вызывает `/orders/:id/pay`, статус меняется на `PAID`, история и уведомления обновляются.

## Локально
```bash
npm install
npm run dev       # http://localhost:6314 (прокси /api через nginx из start-all.sh или свой)
npm run build     # dist/ со статикой
npm run preview   # локальный сервер собранного бандла
```

## Docker
| Режим | Compose | Описание |
| --- | --- | --- |
| Dev | `docker-compose.dev.yaml` | Node 22 + Vite HMR на `${WEBSITE_DEV_PORT:-6314}`, монтируется весь проект, подхватывается `healthcheck.js`. Проксируется через `./start-all.sh dev`. |
| Test | `docker-compose.test.yaml` | Одноразовая сборка SPA внутри контейнера с выводом артефактов в `./dist` на хосте. Используется `./start-all.sh test`, после сборки контейнер гасится, статика отдаётся центральным nginx. |

Оба compose-файла подключаются к `backend-network`, которую создаёт корневой скрипт.

## Проверка состояния
`healthcheck.js` проверяет `/` у dev-сервера и используется Docker'ом для статуса контейнера в HMR-режиме.

## Переменные окружения
- `VITE_DEV_SERVER_PORT` - порт дев-сервера (по умолчанию `6314`).
- `VITE_API_BASE_URL` - базовый URL API (по умолчанию `/api`, подходит за nginx).

`.env` держим в репозитории специально для простого развёртывания демо.
