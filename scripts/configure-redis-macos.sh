#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Configuring Redis for macOS...${NC}"

# Stop Redis if running
echo "Stopping Redis service..."
brew services stop redis

# Backup original Redis configuration
REDIS_CONF="/opt/homebrew/etc/redis.conf"
if [ -f "$REDIS_CONF" ]; then
    echo "Backing up original Redis configuration..."
    cp "$REDIS_CONF" "${REDIS_CONF}.backup"
fi

# Create new Redis configuration
echo "Creating new Redis configuration..."
cat > "$REDIS_CONF" << EOL
# Network
bind 127.0.0.1
port 6379
protected-mode yes

# Performance Optimization
maxmemory 512mb
maxmemory-policy volatile-lru
maxmemory-samples 10
activerehashing yes
hz 100
dynamic-hz yes

# Persistence
dir /opt/homebrew/var/db/redis
dbfilename dump.rdb
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdb-save-incremental-fsync yes

# Logging
loglevel notice
logfile /opt/homebrew/var/log/redis.log

# Security
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""

# Memory Management
lazyfree-lazy-eviction yes
lazyfree-lazy-expire yes
lazyfree-lazy-server-del yes

# Monitoring
latency-monitor-threshold 100
EOL

# Set proper permissions
echo "Setting permissions..."
chmod 644 "$REDIS_CONF"

# Create log directory if it doesn't exist
mkdir -p /opt/homebrew/var/log
touch /opt/homebrew/var/log/redis.log
chmod 644 /opt/homebrew/var/log/redis.log

# Create data directory if it doesn't exist
mkdir -p /opt/homebrew/var/db/redis
chmod 777 /opt/homebrew/var/db/redis

# Start Redis service
echo "Starting Redis service..."
brew services start redis

# Wait for Redis to start
sleep 2

# Test Redis connection
echo "Testing Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}Redis is running and configured successfully!${NC}"
    echo "Configuration file: $REDIS_CONF"
    echo "Log file: /opt/homebrew/var/log/redis.log"
    echo "Data directory: /opt/homebrew/var/db/redis"
else
    echo -e "${RED}Failed to start Redis. Check the logs at /opt/homebrew/var/log/redis.log${NC}"
    exit 1
fi
