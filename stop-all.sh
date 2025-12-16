#!/usr/bin/env bash
set -Eeuo pipefail

MODE="${1:-dev}"

if [[ "${MODE}" != "dev" && "${MODE}" != "test" ]]; then
  echo "Usage: ./stop-all.sh [dev|test]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${ROOT_DIR}"

BACKEND_COMPOSE="./backend/docker-compose.${MODE}.yaml"
WEBSITE_COMPOSE="./website/docker-compose.${MODE}.yaml"
NGINX_COMPOSE="./nginx/docker-compose.${MODE}.yaml"
POSTGRES_COMPOSE="./postgresql/docker-compose.dev.yaml"
PGADMIN_COMPOSE="./pgadmin/docker-compose.dev.yaml"

compose_down() {
  local file="$1"
  if [[ -f "${file}" ]]; then
    docker compose -f "${file}" down --remove-orphans >/dev/null 2>&1 || true
  fi
}

compose_down "${NGINX_COMPOSE}"
compose_down "${WEBSITE_COMPOSE}"
compose_down "${BACKEND_COMPOSE}"
compose_down "${PGADMIN_COMPOSE}"
compose_down "${POSTGRES_COMPOSE}"

docker network rm backend-network >/dev/null 2>&1 || true

echo "Stopped ${MODE} stack."
