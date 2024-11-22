#!/bin/bash

# Set up directories
REDIS_DIR="${HOME}/.redis"
SSL_DIR="$REDIS_DIR/ssl"

echo "Creating Redis directories..."
mkdir -p "$SSL_DIR"

echo "Generating SSL certificates..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SSL_DIR/redis.key" \
    -out "$SSL_DIR/redis.crt" \
    -subj "/C=US/ST=CA/L=SanFrancisco/O=AIFTW/CN=redis.aiftw.be"

echo "Setting up Redis configuration..."
mkdir -p "$(brew --prefix)/etc/redis"
cp config/redis-ssl.conf "$(brew --prefix)/etc/redis/redis.conf"

echo "Configuring Redis..."
# Replace ${HOME} with actual home path in config
sed -i '' "s|\${HOME}|$HOME|g" "$(brew --prefix)/etc/redis/redis.conf"

echo "Restarting Redis service..."
brew services stop redis
brew services start redis

# Wait for Redis to start
sleep 2

echo "Testing standard Redis connection..."
redis-cli ping

echo "Testing SSL Redis connection..."
redis-cli -h localhost -p 6380 --tls \
    --cert "$SSL_DIR/redis.crt" \
    --key "$SSL_DIR/redis.key" ping
