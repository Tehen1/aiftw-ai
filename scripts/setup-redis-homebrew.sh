#!/bin/bash

# Get Homebrew Redis paths
BREW_PREFIX=$(brew --prefix)
REDIS_HOME="$HOME/.redis"
SSL_DIR="$REDIS_HOME/ssl"
REDIS_CONF="$REDIS_HOME/redis.conf"
REDIS_PASS="your-strong-password-here"

echo "Setting up Redis with TLS..."

# Create directories
echo "Creating directories..."
mkdir -p "$REDIS_HOME"
mkdir -p "$SSL_DIR"
mkdir -p "$REDIS_HOME/data"

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
port 6381
protected-mode yes

# TLS/SSL
tls-port 6382
tls-cert-file "$SSL_DIR/redis.crt"
tls-key-file "$SSL_DIR/redis.key"
tls-ca-cert-file "$SSL_DIR/redis.crt"
tls-auth-clients no
tls-protocols "TLSv1.2 TLSv1.3"
tls-replication no
tls-cluster no

# Security
requirepass "$REDIS_PASS"

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Other
daemonize yes
supervised no
loglevel debug
logfile "$REDIS_HOME/redis.log"
dir "$REDIS_HOME/data"
pidfile "$REDIS_HOME/redis.pid"
EOL

# Set permissions
chmod 600 "$SSL_DIR/redis.key"
chmod 644 "$SSL_DIR/redis.crt"
chmod 644 "$REDIS_CONF"

echo "Stopping existing Redis..."
brew services stop redis

echo "Starting Redis with custom config..."
redis-server "$REDIS_CONF"

# Wait for Redis to start
sleep 2

echo "Testing standard connection..."
redis-cli -p 6381 -a "$REDIS_PASS" ping

echo "Testing TLS connection..."
redis-cli -h localhost -p 6382 --tls \
    --cert "$SSL_DIR/redis.crt" \
    --key "$SSL_DIR/redis.key" \
    -a "$REDIS_PASS" \
    --insecure ping

echo "Checking Redis logs..."
tail -n 20 "$REDIS_HOME/redis.log"

echo "Redis setup complete!"
echo "Configuration file: $REDIS_CONF"
echo "Standard port: 6381"
echo "TLS port: 6382"
echo "Password: $REDIS_PASS"

# Update the environment variables
cat >> "$HOME/.zshrc" << EOL

# Redis configuration
export REDIS_HOST=localhost
export REDIS_PORT=6382
export REDIS_PASSWORD="$REDIS_PASS"
export REDIS_TLS_CERT="$SSL_DIR/redis.crt"
export REDIS_TLS_KEY="$SSL_DIR/redis.key"
EOL

echo "Environment variables added to ~/.zshrc"
