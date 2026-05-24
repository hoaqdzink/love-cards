#!/bin/bash

# Love Cards Backend — Stop All Services

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}Stopping all Love Cards services...${NC}"

# Kill all java processes related to love cards
pkill -f "service-discovery-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "config-server-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "api-gateway-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "auth-service-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "template-service-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "order-service-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "card-service-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "notification-service-0.0.1-SNAPSHOT" 2>/dev/null
pkill -f "analytics-service-0.0.1-SNAPSHOT" 2>/dev/null

echo -e "${GREEN}All services stopped ✓${NC}"
