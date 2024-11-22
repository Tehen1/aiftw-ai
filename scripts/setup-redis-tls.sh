#!/bin/bash

# Define paths
REDIS_HOME="/Users/devtehen/.redis"
SSL_DIR="$REDIS_HOME/ssl"
REDIS_CONF="/opt/homebrew/etc/redis/redis.conf"

echo "Setting up Redis with TLS..."

# Create directories
echo "Creating directories..."
mkdir -p "$SSL_DIR"

# Generate SSL certificates
echo "Generating SSL certificates..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/redis.key" \
    -out "$SSL_DIR/redis.crt" \
    -subj "/C=US/ST=CA/L=SanFrancisco/O=AIFTW/CN=redis.aiftw.be"

# Create Redis config
echo "Creating Redis configuration..."
cat > "$REDIS_CONF" << EOL
# Network
bind 127.0.0.1
port 6379
protected-mode yes

# TLS/SSL
tls-port 6380
tls-cert-file $SSL_DIR/redis.crt
tls-key-file $SSL_DIR/redis.key
tls-ca-cert-file $SSL_DIR/redis.crt
tls-auth-clients no
tls-replication no
tls-cluster no

# Security
requirepass "your-strong-password-here"

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Other
daemonize no
supervised auto
loglevel notice
EOL

# Set permissions
chmod 600 "$SSL_DIR/redis.key"
chmod 644 "$SSL_DIR/redis.crt"

echo "Restarting Redis..."
brew services restart redis

# Wait for Redis to start
sleep 2

echo "Testing standard connection..."
redis-cli ping

echo "Testing TLS connection..."
redis-cli -h localhost -p 6380 --tls \
    --cert "$SSL_DIR/redis.crt" \
    --key "$SSL_DIR/redis.key" ping
