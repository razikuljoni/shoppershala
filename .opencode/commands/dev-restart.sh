#!/usr/bin/env bash
# Usage: /dev-restart
# Kill and restart both dev servers

echo "=== Killing processes on dev ports ==="
lsof -ti :3000 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null
echo "Ports cleared. Run 'pnpm dev' to restart."
