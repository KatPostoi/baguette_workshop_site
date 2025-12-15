#!/usr/bin/env bash
set -Eeuo pipefail

MODE="${1:-dev}"

if [[ "${MODE}" != "dev" && "${MODE}" != "prod" ]]; then
  echo "Usage: ./start-all.sh [dev|prod]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${ROOT_DIR}"

if [[ -f "./nginx/.env.nginx" ]]; then
  # shellcheck disable=SC1091
  source "./nginx/.env.nginx"
fi

BACKEND_COMPOSE="./backend/docker-compose.${MODE}.yaml"
WEBSITE_COMPOSE="./website/docker-compose.${MODE}.yaml"
NGINX_COMPOSE="./nginx/docker-compose.${MODE}.yaml"
POSTGRES_COMPOSE="./postgresql/docker-compose.dev.yaml"
PGADMIN_COMPOSE="./pgadmin/docker-compose.dev.yaml"
PRISMA_COMPOSE="./backend/docker-compose.prisma.yaml"

BACKEND_CONTAINER="baguette-backend-${MODE}"
if [[ "${MODE}" == "prod" ]]; then
  WEBSITE_CONTAINER="baguette-website"
  NGINX_CONTAINER="baguette-nginx"
else
  WEBSITE_CONTAINER="baguette-website-dev"
  NGINX_CONTAINER="baguette-nginx-dev"
fi

GATEWAY_PORT="${NGINX_PORT:-8080}"
NETWORK_NAME="backend-network"

ensure_network() {
  if ! docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo "Creating shared network ${NETWORK_NAME}..."
    docker network create "${NETWORK_NAME}"
  fi
}

wait_for_healthy() {
  local container="$1"

  if ! docker inspect "${container}" >/dev/null 2>&1; then
    echo "Container ${container} is not available."
    exit 1
  fi

  local has_health
  has_health="$(docker inspect --format='{{if .State.Health}}true{{else}}false{{end}}' "${container}")"

  echo "Waiting for ${container} to become ready..."
  while true; do
    if [[ "${has_health}" == "true" ]]; then
      local status
      status="$(docker inspect --format='{{.State.Health.Status}}' "${container}")"
      if [[ "${status}" == "healthy" ]]; then
        break
      fi
      if [[ "${status}" == "unhealthy" ]]; then
        docker logs "${container}" || true
        echo "Container ${container} became unhealthy."
        exit 1
      fi
    else
      local state
      state="$(docker inspect --format='{{.State.Status}}' "${container}")"
      if [[ "${state}" == "running" ]]; then
        break
      fi
      if [[ "${state}" == "exited" || "${state}" == "dead" ]]; then
        docker logs "${container}" || true
        echo "Container ${container} exited unexpectedly."
        exit 1
      fi
    fi
    sleep 2
  done
  echo "Container ${container} is ready."
}

compose_up() {
  local file="$1"
  if [[ ! -f "${file}" ]]; then
    echo "Compose file ${file} not found."
    exit 1
  fi
  docker compose -f "${file}" up -d --build
}

echo "Stopping existing ${MODE} stack (if any)..."
./stop-all.sh "${MODE}" >/dev/null 2>&1 || true

ensure_network

compose_up "${POSTGRES_COMPOSE}"
wait_for_healthy "baguette-postgres"

if [[ -f "${PRISMA_COMPOSE}" ]]; then
  echo "Applying Prisma schema and seeding demo data..."
  docker compose -f "${PRISMA_COMPOSE}" build prisma
  docker compose -f "${PRISMA_COMPOSE}" run --rm prisma
else
  echo "Prisma compose file ${PRISMA_COMPOSE} is missing, skipping schema sync."
fi

compose_up "${PGADMIN_COMPOSE}"

compose_up "${BACKEND_COMPOSE}"
wait_for_healthy "${BACKEND_CONTAINER}"

compose_up "${WEBSITE_COMPOSE}"
wait_for_healthy "${WEBSITE_CONTAINER}"

compose_up "${NGINX_COMPOSE}"
wait_for_healthy "${NGINX_CONTAINER}"

cat <<EOF
Stack is ready in ${MODE} mode.

Gateway:      http://localhost:${GATEWAY_PORT}/
API proxy:    http://localhost:${GATEWAY_PORT}/api/
PgAdmin:      http://localhost:${GATEWAY_PORT}/pgadmin/ (admin@example.com / admin by default)

To stop everything: ./stop-all.sh ${MODE}
EOF
