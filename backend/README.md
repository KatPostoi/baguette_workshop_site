# Baguette Workshop Backend

## Quick start
1. Shared Docker network is created automatically by `./start-all.sh`, but you can also run `docker network create backend-network`.
2. Review `.env.backend` (committed on purpose). Mock providers are enabled through `PAYMENTS_PROVIDER=mock` and `DELIVERY_PROVIDER=mock`.
3. Local development (outside Docker):
   ```bash
   cd app
   yarn install
   yarn start:dev
   ```
4. Containerized run (PostgreSQL + pgAdmin must be up first):
   ```bash
   docker compose -f docker-compose.dev.yaml up -d --build
   # production image used by ./start-all.sh prod
   docker compose -f docker-compose.prod.yaml up -d --build
   ```
5. Apply Prisma schema + seed demo data (automatically triggered by `./start-all.sh` but can be executed manually):
   ```bash
   docker compose -f docker-compose.prisma.yaml run --rm prisma
   ```

## Structure
- `app/src` - NestJS application (AppModule, health checks, catalog-related modules).
- `app/tsconfig*.json`, `nest-cli.json` - TypeScript and Nest CLI configs.
- `prisma/` - schema definition and seed scripts.
- `docker/` - runtime Dockerfiles.
- `.env.backend` - environment variables committed for easy demo deployments.
- `docker-compose.prisma.yaml` - helper compose file that runs `yarn prisma:sync && yarn prisma:seed` inside a throwaway container (used by `./start-all.sh`).

## Docker targets
- `docker/dev/Dockerfile` – hot-reload image (mounts `app/` and installs deps on the fly). Used by `docker-compose.dev.yaml` and `./start-all.sh dev`.
- `docker/prod/Dockerfile` – multi-stage build + slim runtime. Used by `docker-compose.prod.yaml` and `./start-all.sh prod`.

## Useful scripts
- `yarn build` - compile to `dist/`.
- `yarn start` - start without watch mode.
- `yarn start:dev` - hot reload mode.
- `yarn prisma:generate` - regenerate Prisma Client (loads `.env.backend`).
- `yarn prisma:migrate` - apply dev migrations (PostgreSQL must be running).
- `yarn prisma:seed` - reset and seed demo data.
- `yarn prisma:sync` - apply the current schema via `prisma db push` (used in the Docker bootstrap).

## REST API (v1)
- `GET /catalog` - list of frames with material/style info.
- `GET /catalog/:slug` - frame details by slug.
- `GET /materials` / `GET /materials/:id` - materials catalog.
- `GET /styles` / `GET /styles/:id` - framing styles.
- `GET /services` / `GET /services/:id` - extra workshop services.
- `GET|POST|DELETE /favorites/:userId` - manage user favorites.
- `GET /basket/:userId/items` - list basket items.
- `POST|PATCH|DELETE /basket/:userId/items` - add/update/remove specific items.
- `DELETE /basket/:userId` - clear the basket.
- `POST /auth/login` - exchange credentials for a JWT (7 day TTL).
- `GET /orders`, `GET /orders/:id`, `POST /orders` - checkout endpoints.
- `PATCH /orders/:id/status` - update status (with validation of transitions).
- `POST /payments/mock` - simulate payment via mock gateway, returns receipt + updates status.
- `POST /delivery/schedule` - mock delivery booking (status `SHIPPED` + tracking data).
- `GET /notifications/order/:orderId` - order activity log.
- `GET /orders/:id/timeline` - combined timeline (currently notifications) used by the order details UI.

## Next steps
Future iterations can build dashboards or hook real payment/delivery providers by replacing the existing mock gateways without changing the API. For now everything is wired to mock implementations to keep deployments simple.
