# Baguette Workshop Website

React + TypeScript + Vite SPA. The frontend now reads and mutates data exclusively through the NestJS backend (`/api/*`) using a small API layer plus React context stores for the basket and favorites.

## Local development
```bash
npm install
npm run dev       # http://localhost:5173 (proxy /api via start-all.sh or your own proxy)
npm run build     # compile & bundle to dist/
npm run preview   # serve the production bundle locally
```

## Docker flows
| Mode | Compose file | Description |
| --- | --- | --- |
| Dev | `docker-compose.dev.yaml` | Mounts the repo into a Node 22 container, installs deps and runs Vite with HMR on `${WEBSITE_DEV_PORT:-5173}`. `./start-all.sh dev` proxies it via nginx. |
| Prod | `docker-compose.prod.yaml` | Builds the SPA and serves it via nginx (port `${WEBSITE_PROD_PORT:-4173}`), health-checked and proxied at `http://localhost:${NGINX_PORT:-8080}`. |

Both compose files join the shared `backend-network` the root scripts create automatically.

## Health check
`healthcheck.js` performs a GET on `/` to ensure the dev/prod server is reachable. Docker uses it to keep the container marked healthy before nginx starts routing traffic.

## Environment variables
- `VITE_DEV_SERVER_PORT` – overrides the dev server port (default `5173`).
- `VITE_API_BASE_URL` – base URL for API calls (defaults to `/api`, which works behind nginx/start-all.sh).
- `VITE_DEMO_USER_ID` – UUID of the demo customer used for basket/favorite mutations (defaults to the seeded demo user).

Keep `.env` files in the repo so the demo can be launched anywhere without extra secret management.
