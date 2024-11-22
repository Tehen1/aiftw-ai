#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Redis
apt-get install -y redis-server openssl

# Create SSL directory
mkdir -p /etc/redis/ssl
cd /etc/redis/ssl

# Generate SSL certificates
openssl genrsa -out redis.key 2048
openssl req -new -x509 -nodes -sha256 -days 365 -key redis.key -out redis.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Secure permissions
chown redis:redis /etc/redis/ssl/redis.key /etc/redis/ssl/redis.crt
chmod 600 /etc/redis/ssl/redis.key

# Backup original Redis config
cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# Configure Redis with SSL and password
cat > /etc/redis/redis.conf << EOL
bind 0.0.0.0
port 6382
tls-port 6382
tls-cert-file /etc/redis/ssl/redis.crt
tls-key-file /etc/redis/ssl/redis.key
tls-auth-clients no
requirepass Juliadilove07!
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log
dir /var/lib/redis
maxmemory 256mb
maxmemory-policy allkeys-lru
EOL

# Set proper permissions
chown redis:redis /etc/redis/redis.conf
chmod 640 /etc/redis/redis.conf

# Restart Redis
systemctl restart redis-server
systemctl enable redis-server

# Check Redis status
systemctl status redis-server

# Copy certificates to a location we can access
mkdir -p /root/redis-certs
cp /etc/redis/ssl/redis.crt /root/redis-certs/
cp /etc/redis/ssl/redis.key /root/redis-certs/
chmod 644 /root/redis-certs/redis.crt
chmod 644 /root/redis-certs/redis.key
