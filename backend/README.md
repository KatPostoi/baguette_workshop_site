# Baguette Workshop Backend

## Быстрый старт
1. Сеть создаёт `./start-all.sh`, при необходимости: `docker network create backend-network`.
2. Проверьте `.env.backend` (лежит в репо). Провайдеры платежей/доставки выставлены в `mock`.
3. Локально без Docker:
   ```bash
   cd app
   yarn install
   yarn start:dev
   ```
4. В контейнере (PostgreSQL + pgAdmin должны быть запущены):
   ```bash
   docker compose -f docker-compose.dev.yaml up -d --build   # HMR
   docker compose -f docker-compose.test.yaml up -d --build  # продоподобный единичный инстанс
   ```
5. Prisma схема + сиды (автоматически дергается из `./start-all.sh`, но можно вручную):
   ```bash
   docker compose -f docker-compose.prisma.yaml run --rm prisma
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
- `yarn build` - сборка в `dist/`.
- `yarn start` - запуск без watch.
- `yarn start:dev` - hot reload.
- `yarn prisma:generate|migrate|seed|sync` - Prisma утилиты (читают `.env.backend`).
- Тестов пока нет; как только появятся, гоняйте их из dev-контейнера, например:  
  `docker compose -f docker-compose.dev.yaml exec backend yarn test`

## REST API (v1)
- `GET /catalog` - список рамок, материалов и стилей.
- `GET /catalog/:slug` - детали рамки.
- `GET /materials` / `GET /materials/:id` - каталог материалов.
- `GET /styles` / `GET /styles/:id` - каталог стилей.
- `GET /services` / `GET /services/:id` - доп. услуги мастерской.
- `GET|POST|DELETE /favorites/:userId` - избранное.
- `GET /basket/:userId/items` - содержимое корзины.
- `POST|PATCH|DELETE /basket/:userId/items` - управление конкретными позициями.
- `DELETE /basket/:userId` - очистка корзины.
- `POST /auth/login` - выдача JWT (7 дней).
- `GET /orders`, `GET /orders/:id`, `POST /orders` - заказ/оформление.
- `PATCH /orders/:id/status` - смена статуса (валидация переходов).
- `POST /payments/mock` - имитация оплаты + чек.
- `POST /delivery/schedule` - имитация доставки (статус `SHIPPED` + трекинг).
- `GET /notifications/order/:orderId` - история уведомлений.
- `GET /orders/:id/timeline` - объединённый таймлайн заказа.
