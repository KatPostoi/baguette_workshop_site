# Nginx Gateway

Reverse proxy that exposes every service through a single entry point.

## How to run
```bash
# Dev mode – proxies to the Vite container + backend dev container
docker compose -f docker-compose.dev.yaml up -d --build

# Prod mode – proxies to the production website + backend containers
docker compose -f docker-compose.prod.yaml up -d --build
```

Both compose files read `.env.nginx` (default `NGINX_PORT=8080`) and join the shared `backend-network`. The root `./start-all.sh` script spins up the correct variant automatically.

## Config files
- `files/nginx.dev.conf` – proxies `/` to `baguette-website-dev:5173`, `/api/` to `baguette-backend-dev:3000`, `/pgadmin/` to `baguette-pgadmin:5050`.
- `files/nginx.conf` – same routing but targeting the production containers (`baguette-website`, `baguette-backend-prod`).
- `files/html/` – optional static assets (copied into the image for maintenance pages).

## Health checks & logs
- Both Dockerfiles install `curl` and expose `/healthz` endpoints that Docker uses for health checks.
- Logs live under `logs/` and are bind-mounted so they persist across restarts.
