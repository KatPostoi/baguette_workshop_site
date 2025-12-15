# PostgreSQL Service

## How to run
1. Make sure `backend-network` exists: `docker network create backend-network` (run once, or let `./start-all.sh` create it automatically).
2. Start the database: `docker compose -f docker-compose.dev.yaml up -d --build` (used by both dev/prod stacks).
3. Initial data directory lives in `pgdata/` and is created automatically.

## Resetting data
- Full reset: `docker compose down -v` removes the `pgdata` volume.
- After pruning, start the stack again with `docker compose up -d`.

## Environment variables
Edit `.env.postgres` if you need different credentials. The file is committed to keep demo deployments frictionless, and Docker health checks read the same values to wait until PostgreSQL is ready.
