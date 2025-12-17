# Сервис pgAdmin

## Как запустить
1. Убедитесь, что PostgreSQL и сеть `backend-network` уже существуют (или запустите `./start-all.sh dev`, который поднимет оба сервиса).
2. Запустите UI: `docker compose -f docker-compose.dev.yaml up -d --build`.
3. Откройте http://localhost:5050 (или http://localhost:${NGINX_PORT:-8080}/pgadmin/ через шлюз) и авторизуйтесь данными из `.env.pgadmin`.
4. Преднастроенный сервер `baguette-postgres` загрузится автоматически (значения берутся из `.env.postgres`).

## Сброс состояния
- Остановите контейнер и удалите тома: `docker compose down -v`.

## Переменные окружения
- Меняйте `.env.pgadmin`, если нужны другие учётные данные. Файл лежит в git, чтобы демо-развёртывание оставалось простым.
