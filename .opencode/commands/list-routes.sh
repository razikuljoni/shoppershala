#!/usr/bin/env bash
# Usage: /list-routes
# List all API routes defined in the backend

echo "=== API Routes ==="
grep -rn "router\.\(get\|post\|patch\|put\|delete\)" apps/backend/src/routes/ \
  | grep -v "node_modules" \
  | sed 's/.*src\/routes\///' \
  | sed 's/\.routes\.js:/:/' \
  | sed 's/.*router\.\([a-z]*\)(/\1 /' \
  | sed 's/,.*)//g' \
  | awk '{print $1, $2}'
