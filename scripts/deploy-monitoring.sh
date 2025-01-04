#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting AIFTW monitoring deployment...${NC}"

# Create necessary directories
mkdir -p /opt/aiftw/monitoring/{prometheus,grafana,redis-exporter}
mkdir -p /opt/aiftw/monitoring/prometheus/rules
mkdir -p /opt/aiftw/monitoring/grafana/dashboards

# Copy configuration files
echo "Copying configuration files..."
cp ../monitoring/prometheus/prometheus.yml /opt/aiftw/monitoring/prometheus/
cp ../monitoring/grafana/dashboards/*.json /opt/aiftw/monitoring/grafana/dashboards/

# Deploy Redis Exporter
echo "Deploying Redis Exporter..."
docker run -d \
    --name redis-exporter \
    --network monitoring \
    -p 9121:9121 \
    oliver006/redis_exporter:latest

# Deploy Prometheus
echo "Deploying Prometheus..."
docker run -d \
    --name prometheus \
    --network monitoring \
    -p 9090:9090 \
    -v /opt/aiftw/monitoring/prometheus:/etc/prometheus \
    prom/prometheus:latest

# Deploy Grafana
echo "Deploying Grafana..."
docker run -d \
    --name grafana \
    --network monitoring \
    -p 3000:3000 \
    -v /opt/aiftw/monitoring/grafana:/var/lib/grafana \
    grafana/grafana:latest

# Configure Redis
echo "Applying Redis optimizations..."
redis-cli CONFIG SET maxmemory "512mb"
redis-cli CONFIG SET maxmemory-policy "volatile-lru"
redis-cli CONFIG SET maxmemory-samples 10
redis-cli CONFIG SET activerehashing yes
redis-cli CONFIG SET hz 100
redis-cli CONFIG SET dynamic-hz yes

# Verify deployments
echo "Verifying deployments..."
services=("redis-exporter" "prometheus" "grafana")
for service in "${services[@]}"; do
    if docker ps | grep -q $service; then
        echo -e "${GREEN}✓ $service is running${NC}"
    else
        echo -e "${RED}✗ $service failed to start${NC}"
        exit 1
    fi
done

echo -e "${GREEN}Monitoring setup completed!${NC}"
echo "Grafana is available at: http://localhost:3000"
echo "Prometheus is available at: http://localhost:9090"
echo "Redis Exporter metrics at: http://localhost:9121/metrics"
