# pgAdmin Service

## How to run
1. Ensure PostgreSQL and the `backend-network` already exist (or run `./start-all.sh dev` which starts both services).
2. Start the UI: `docker compose -f docker-compose.dev.yaml up -d --build`.
3. Open http://localhost:5050 (or http://localhost:${NGINX_PORT:-8080}/pgadmin/ via the gateway) and log in with credentials from `.env.pgadmin`.
4. The preconfigured `baguette-postgres` server loads automatically (values come from `.env.postgres`).

## Resetting state
- Remove local settings by stopping and pruning volumes: `docker compose down -v`.

## Environment variables
- Adjust `.env.pgadmin` whenever you need different credentials. The file stays in git to keep demo deployments simple.
