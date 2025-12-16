# Демо-стек Baguette Workshop

Минимальный демонстрационный стек: NestJS API, Vite SPA, PostgreSQL, pgAdmin и nginx-гейтвей с единым входом.

## Быстрый старт
```bash
# dev: горячая перезагрузка фронта/бека
./start-all.sh dev

# test: собираем SPA один раз, отдаём статику через nginx
./start-all.sh test

# остановить
./stop-all.sh dev
./stop-all.sh test
```

Гейтвей слушает `http://localhost:${NGINX_PORT:-8080}`:
- `/` — фронтенд (dev: прокси на Vite, test: статика из `website/dist`).
- `/api/` — NestJS backend.
- `/pgadmin/` — pgAdmin UI (`admin@example.com` / `admin` по умолчанию).

При старте автоматически выполняется `backend/docker-compose.prisma.yaml` (синхронизация Prisma + сиды демо-данных).

## Сервисы
- `website/` — React + Vite: `docker-compose.dev.yaml` (HMR) и `docker-compose.test.yaml` (одноразовая сборка SPA).
- `backend/` — NestJS API: `docker-compose.dev.yaml` (HMR) и `docker-compose.test.yaml` (единственный инстанс).
- `postgresql/` — PostgreSQL 17 с коммитнутой `.env.postgres`.
- `pgadmin/` — pgAdmin 4, настроенный на локальную БД.
- `nginx/` — проксирует UI/API/pgAdmin, есть отдельные конфиги `nginx.dev.conf` и `nginx.test.conf`.

Все сервисы сидят в общей внешней сети `backend-network`; `start-all.sh` создаёт её при необходимости:
```bash
docker network create backend-network
```

## Ручной запуск
```bash
cd postgresql && docker compose -f docker-compose.dev.yaml up -d
cd pgadmin    && docker compose -f docker-compose.dev.yaml up -d
cd backend    && docker compose -f docker-compose.dev.yaml up -d --build    # либо docker-compose.test.yaml
cd website    && docker compose -f docker-compose.dev.yaml up -d --build    # либо docker-compose.test.yaml
cd nginx      && docker compose -f docker-compose.dev.yaml up -d --build    # либо docker-compose.test.yaml
```

`.env*` файлы намеренно хранятся в репозитории, чтобы демо поднималось на чистой машине без секрет-менеджеров.
