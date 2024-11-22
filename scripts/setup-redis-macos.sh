#!/bin/bash

# Create directories
mkdir -p /usr/local/etc/redis
mkdir -p /usr/local/var/log/redis
mkdir -p /usr/local/var/lib/redis
mkdir -p /usr/local/etc/redis/ssl

# Copy configuration file
cp config/redis.production.conf /usr/local/etc/redis/redis.conf

# Generate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /usr/local/etc/redis/ssl/redis.key \
    -out /usr/local/etc/redis/ssl/redis.crt \
    -subj "/C=US/ST=CA/L=SanFrancisco/O=AIFTW/CN=redis.aiftw.be"

# Update configuration paths
sed -i '' "s|/path/to/redis.crt|/usr/local/etc/redis/ssl/redis.crt|g" /usr/local/etc/redis/redis.conf
sed -i '' "s|/path/to/redis.key|/usr/local/etc/redis/ssl/redis.key|g" /usr/local/etc/redis/redis.conf
sed -i '' "s|/path/to/ca.crt|/usr/local/etc/redis/ssl/redis.crt|g" /usr/local/etc/redis/redis.conf

# Update logfile path
sed -i '' "s|/var/log/redis/redis-server.log|/usr/local/var/log/redis/redis-server.log|g" /usr/local/etc/redis/redis.conf

# Stop Redis if running
brew services stop redis

# Start Redis with new configuration
brew services start redis --config=/usr/local/etc/redis/redis.conf

# Verify Redis is running
sleep 2
redis-cli ping
