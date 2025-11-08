#!/bin/bash

echo "=== ARTF Building System Diagnostics ==="
echo ""

echo "1. Checking Docker Compose status..."
docker-compose ps
echo ""

echo "2. Checking if containers are running..."
docker ps | grep artf
echo ""

echo "3. Checking app container logs (last 50 lines)..."
docker-compose logs --tail=50 app
echo ""

echo "4. Checking if port 3000 is listening..."
docker-compose exec app netstat -tlnp 2>/dev/null || docker-compose exec app ss -tlnp 2>/dev/null || echo "Could not check ports"
echo ""

echo "5. Checking environment variables in container..."
docker-compose exec app env | grep NODE_ENV
echo ""

echo "6. Testing server response from inside container..."
docker-compose exec app wget -O- http://localhost:3000 2>&1 | head -20
echo ""

echo "=== Diagnostics Complete ==="
