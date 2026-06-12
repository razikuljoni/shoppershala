#!/usr/bin/env bash
# Usage: /db-check
# Check MongoDB connection status

echo "=== MongoDB Status Check ==="
docker compose ps 2>/dev/null | grep -q "Up" && echo "✅ MongoDB is running" || echo "❌ MongoDB is not running"
echo ""
echo "Run 'docker compose up -d' to start MongoDB"
