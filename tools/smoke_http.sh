#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${BASE_URL:-http://localhost:3000}}"

printf "[smoke] GET %s/health\n" "$BASE_URL"

curl -sS "$BASE_URL/health"
echo
