# Сервис PostgreSQL

## Как запустить
1. Убедитесь, что существует сеть `backend-network`: `docker network create backend-network` (можно разово, или доверить `./start-all.sh`).
2. Поднимите базу: `docker compose -f docker-compose.dev.yaml up -d --build` (используется и для dev, и для test).
3. Данные лежат в `pgdata/` и создаются автоматически.

## Сброс данных
- Полный сброс: `docker compose down -v` удалит volume `pgdata`.
- После очистки снова запустите `docker compose up -d`.

## Переменные окружения
Правьте `.env.postgres`, если нужны другие креды. Файл лежит в репозитории намеренно, healthcheck использует те же значения, чтобы дождаться готовности Postgres.
