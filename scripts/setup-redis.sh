#!/bin/bash

# Create necessary directories
sudo mkdir -p /etc/redis
sudo mkdir -p /var/log/redis
sudo mkdir -p /var/lib/redis
sudo mkdir -p /etc/redis/ssl

# Copy configuration
sudo cp ../config/redis.production.conf /etc/redis/redis.conf

# Generate SSL certificates (replace with your actual certificate paths)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/redis/ssl/redis.key \
    -out /etc/redis/ssl/redis.crt \
    -subj "/C=US/ST=CA/L=SanFrancisco/O=AIFTW/CN=redis.aiftw.be"

# Update configuration paths
sudo sed -i "s|/path/to/redis.crt|/etc/redis/ssl/redis.crt|g" /etc/redis/redis.conf
sudo sed -i "s|/path/to/redis.key|/etc/redis/ssl/redis.key|g" /etc/redis/redis.conf
sudo sed -i "s|/path/to/ca.crt|/etc/redis/ssl/redis.crt|g" /etc/redis/redis.conf

# Set permissions
sudo chown -R redis:redis /etc/redis
sudo chown -R redis:redis /var/log/redis
sudo chown -R redis:redis /var/lib/redis

# Start Redis
sudo systemctl restart redis

# Check status
sudo systemctl status redis
