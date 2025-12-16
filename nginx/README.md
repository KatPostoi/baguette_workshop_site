# Шлюз Nginx

Единая точка входа для UI/API/pgAdmin.

## Запуск
```bash
# dev — прокси на Vite (HMR) и backend dev
docker compose -f docker-compose.dev.yaml up -d --build

# test — статика из website/dist + backend test
docker compose -f docker-compose.test.yaml up -d --build
```

Оба compose читают `.env.nginx` (`NGINX_PORT=8080` по умолчанию) и используют `backend-network`. Корневой `./start-all.sh` поднимает нужный вариант автоматически.

## Конфиги
- `files/nginx.dev.conf` — `/` → `baguette-website-dev:5173`, `/api/` → `baguette-backend-dev:3000`, `/pgadmin/` → `baguette-pgadmin:5050`.
- `files/nginx.test.conf` — `/` → статика из `website/dist`, `/api/` → `baguette-backend-test:3000`, `/pgadmin/` → `baguette-pgadmin:5050`.
- `files/html/` — опциональные статические страницы.

## Health checks и логи
- Dockerfile’ы ставят `curl` и экспонируют `/healthz` для healthcheck.
- Логи пишутся в `logs/` (bind-mount).
