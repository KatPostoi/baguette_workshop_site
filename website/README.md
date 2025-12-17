# Веб-сайт Baguette Workshop

React + TypeScript + Vite SPA. Взаимодействует с бэкендом только через `/api/*`.

## Локально
```bash
npm install
npm run dev       # http://localhost:5173 (прокси /api через nginx из start-all.sh или свой)
npm run build     # dist/ со статикой
npm run preview   # локальный сервер собранного бандла
```

## Docker
| Режим | Compose | Описание |
| --- | --- | --- |
| Dev | `docker-compose.dev.yaml` | Node 22 + Vite HMR на `${WEBSITE_DEV_PORT:-5173}`, монтируется весь проект, подхватывается `healthcheck.js`. Проксируется через `./start-all.sh dev`. |
| Test | `docker-compose.test.yaml` | Одноразовая сборка SPA внутри контейнера с выводом артефактов в `./dist` на хосте. Используется `./start-all.sh test`, после сборки контейнер гасится, статика отдаётся центральным nginx. |

Оба compose-файла подключаются к `backend-network`, которую создаёт корневой скрипт.

## Проверка состояния
`healthcheck.js` проверяет `/` у dev-сервера и используется Docker'ом для статуса контейнера в HMR-режиме.

## Переменные окружения
- `VITE_DEV_SERVER_PORT` - порт дев-сервера (по умолчанию `5173`).
- `VITE_API_BASE_URL` - базовый URL API (по умолчанию `/api`, подходит за nginx).
- `VITE_DEMO_USER_ID` - демо-пользователь для корзины/избранного (по умолчанию сид).

`.env` держим в репозитории специально для простого развёртывания демо.
