#!/bin/bash

# Love Cards Backend — Start All Services
# Usage: ./start-all.sh

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

LOG_DIR="logs"
mkdir -p $LOG_DIR

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Love Cards Backend — Starting...    ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if Docker containers are running
echo -e "\n${YELLOW}[0/4] Checking infrastructure...${NC}"
if ! docker compose ps --status running | grep -q "lovecards-postgres"; then
    echo "PostgreSQL not running. Starting docker compose..."
    docker compose up -d
    sleep 5
else
    echo -e "${GREEN}Infrastructure already running ✓${NC}"
fi

# 1. Service Discovery
echo -e "\n${YELLOW}[1/4] Starting Service Discovery (port 8761)...${NC}"
java -jar service-discovery/target/service-discovery-0.0.1-SNAPSHOT.jar > $LOG_DIR/service-discovery.log 2>&1 &
echo "PID: $!"
sleep 12

# Check if Eureka is ready
until curl -s http://localhost:8761 > /dev/null 2>&1; do
    echo "Waiting for Eureka..."
    sleep 3
done
echo -e "${GREEN}Service Discovery ready ✓${NC}"

# 2. Config Server
echo -e "\n${YELLOW}[2/4] Starting Config Server (port 8888)...${NC}"
java -jar config-server/target/config-server-0.0.1-SNAPSHOT.jar > $LOG_DIR/config-server.log 2>&1 &
echo "PID: $!"
sleep 10

until curl -s http://localhost:8888/actuator/health > /dev/null 2>&1; do
    echo "Waiting for Config Server..."
    sleep 3
done
echo -e "${GREEN}Config Server ready ✓${NC}"

# 3. API Gateway
echo -e "\n${YELLOW}[3/4] Starting API Gateway (port 8080)...${NC}"
java -jar api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar > $LOG_DIR/api-gateway.log 2>&1 &
echo "PID: $!"
sleep 8

# 4. Business Services (parallel)
echo -e "\n${YELLOW}[4/4] Starting Business Services...${NC}"

java -jar auth-service/target/auth-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/auth-service.log 2>&1 &
echo "  auth-service (port 8081) — PID: $!"

java -jar template-service/target/template-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/template-service.log 2>&1 &
echo "  template-service (port 8082) — PID: $!"

java -jar order-service/target/order-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/order-service.log 2>&1 &
echo "  order-service (port 8083) — PID: $!"

java -jar card-service/target/card-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/card-service.log 2>&1 &
echo "  card-service (port 8084) — PID: $!"

java -jar notification-service/target/notification-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/notification-service.log 2>&1 &
echo "  notification-service (port 8085) — PID: $!"

java -jar analytics-service/target/analytics-service-0.0.1-SNAPSHOT.jar > $LOG_DIR/analytics-service.log 2>&1 &
echo "  analytics-service (port 8086) — PID: $!"

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}   All services started!               ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Eureka Dashboard:  http://localhost:8761"
echo "API Gateway:       http://localhost:8080"
echo "RabbitMQ UI:       http://localhost:15672"
echo ""
echo "Logs:              ./logs/*.log"
echo "Stop all:          ./stop-all.sh"
echo ""

wait
