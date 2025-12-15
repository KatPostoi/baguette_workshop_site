# Baguette Workshop Dev Stack

Pet project stack that mirrors the `goose-game` layout: NestJS API, Vite SPA, PostgreSQL, pgAdmin and a lightweight nginx gateway that proxies everything through a single entry point.

## Quick start
```bash
# start dev stack (Vite dev server + hot reload)
./start-all.sh dev

# tear it down
./stop-all.sh dev

# run the production build (both services inside optimized containers)
./start-all.sh prod
./stop-all.sh prod
```

The gateway exposes everything under `http://localhost:${NGINX_PORT:-8080}`:
- `/` – frontend (proxied either to the Vite dev server or to the production website container).
- `/api/` – NestJS backend.
- `/pgadmin/` – pgAdmin UI (defaults: `admin@example.com` / `admin`).

During startup the script also runs `backend/docker-compose.prisma.yaml`, which applies the Prisma schema (`yarn prisma:sync`) and seeds the demo catalog so the API/UI immediately have data to show.

## Services
- `website/` – React + Vite project with dedicated dev/prod Dockerfiles (`docker-compose.dev|prod.yaml`).
- `backend/` – NestJS API with Prisma, mock payment/delivery gateways and dev/prod docker setups.
- `postgresql/` – PostgreSQL 17 instance with tuned defaults and a committed `.env.postgres`.
- `pgadmin/` – pgAdmin 4 UI configured against the local database.
- `nginx/` – reverse-proxy that glues the UI, API and pgAdmin together (separate dev/prod configs).

All services join the shared external network `backend-network`. The start script creates it on demand, but you can also do it manually:
```bash
docker network create backend-network
```

## Manual control
Every directory contains its own compose files so you can start services individually:
```bash
cd postgresql && docker compose -f docker-compose.dev.yaml up -d
cd pgadmin && docker compose -f docker-compose.dev.yaml up -d
cd backend && docker compose -f docker-compose.dev.yaml up -d --build      # or docker-compose.prod.yaml
cd website && docker compose -f docker-compose.dev.yaml up -d --build      # or docker-compose.prod.yaml
cd nginx && docker compose -f docker-compose.dev.yaml up -d --build        # or docker-compose.prod.yaml
```

All `.env.*` files stay in git on purpose so the demo can be launched on any machine without extra secret management.
