# Baguette Workshop Backend

## Быстрый старт
1. Сеть создаёт `./start-all.sh`, при необходимости: `docker network create backend-network`.
2. Проверьте `.env.backend` (в репо): `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES`; провайдеры платежей/доставки выставлены в `mock`.
3. Один запуск всего стека (Postgres + prisma sync/generate/seed + backend + frontend + nginx):
   ```bash
   ./start-all.sh dev
   ```
4. Если нужно вручную прогнать схему/сид на чистой БД:
   ```bash
   cd app
   npm install
   npx prisma db push
   npx prisma generate
   npx prisma db seed
   ```
5. Локально без Docker (только бэкенд):
   ```bash
   cd app
   npm install
   npm run start:dev
   ```

## Структура
- `app/src` - NestJS приложение.
- `prisma/` - схема и сиды.
- `docker/` - Dockerfile'ы для dev/test.
- `.env.backend` - демонстрационные переменные окружения (хранятся в git осознанно).
- `docker-compose.prisma.yaml` - одноразовый контейнер для `prisma:sync` + сидов.

## Docker-сборки
- `docker/dev/Dockerfile` - hot reload, монтирует `app/`. Используется `docker-compose.dev.yaml`.
- `docker/test/Dockerfile` - multi-stage билд + slim runtime. Используется `docker-compose.test.yaml`.

## Полезное
- `npm run build` - сборка в `dist/`.
- `npm run start` - запуск без watch.
- `npm run start:dev` - hot reload.
- `npm run prisma:generate|migrate|seed|sync` - Prisma утилиты (читают `.env.backend`).
- Тестов пока нет; как только появятся, гоняйте их из dev-контейнера, например:  
  `docker compose -f docker-compose.dev.yaml exec backend yarn test`

## REST API (v1)
- `GET /catalog` - список рамок, материалов и стилей.
- `GET /catalog/:slug` - детали рамки.
- `GET /materials` / `GET /materials/:id` - каталог материалов.
- `GET /styles` / `GET /styles/:id` - каталог стилей.
- `GET /services` / `GET /services/:id` - доп. услуги мастерской.
- `GET|POST|DELETE /favorites` - избранное (требует JWT).
- `GET /basket/items` - содержимое корзины (требует JWT).
- `POST|PATCH|DELETE /basket/items` - управление конкретными позициями (требует JWT).
- `DELETE /basket` - очистка корзины (требует JWT).
- `POST /auth/login` / `POST /auth/register` - выдача access JWT (7 дней), httpOnly refresh-cookie (`refresh_token`), поле `role` в payload.
- `GET /auth/me` - профиль текущего пользователя (требует JWT, роль отражается в `role`).
- `POST /auth/refresh` - обновление access по httpOnly refresh-cookie; логика remember-me на фронте выбирает localStorage/sessionStorage для access.
- `POST /auth/logout` - обнуление refresh-cookie.
- `GET /orders`, `GET /orders/:id`, `POST /orders` - заказ/оформление.
- `PATCH /orders/:id/status` - смена статуса (валидация переходов), доступно только ADMIN.
- `PATCH /orders/:id/cancel` - отмена заказа пользователем (из ранних статусов).
- `GET /admin/orders` - список заказов (фильтры: status, from, to, userId, teamId), только ADMIN.
- `GET /admin/orders/:id` / `:id/timeline` - просмотр заказа/таймлайна, только ADMIN.
- `PATCH /admin/orders/:id/status` - смена статуса заказа, только ADMIN.
- `PATCH /admin/orders/bulk/status` - массовая смена статуса заказов, только ADMIN.
- `PATCH /admin/orders/:id/team` - назначить команду (teamId), только ADMIN.
- `GET/POST/PATCH /admin/teams` - управление командами мастеров, только ADMIN.

Новые статусы заказов: PENDING, PAID, ASSEMBLY, READY_FOR_PICKUP, IN_TRANSIT (для доставки), RECEIVED, COMPLETED, CANCELLED.

## Тестовые пользователи (seed)
- Админы:
  - `admin1@baguette.local` / `password`
  - `admin2@baguette.local` / `password`
- Покупатели:
  - `customer1@baguette.local` / `password`
  - `customer2@baguette.local` / `password`
  - `customer3@baguette.local` / `password`
- `POST /payments/mock` - имитация оплаты + чек.
- `POST /delivery/schedule` - имитация доставки (статус `SHIPPED` + трекинг).
- `GET /notifications/order/:orderId` - история уведомлений.
- `GET /orders/:id/timeline` - объединённый таймлайн заказа.
