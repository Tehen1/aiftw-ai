#!/bin/bash

echo "Cleaning up Redis installation..."

# Stop Redis service
echo "1337!" | sudo -S brew services stop redis

# Remove Redis data directory
echo "1337!" | sudo -S rm -rf /opt/homebrew/var/db/redis

# Remove Redis log file
echo "1337!" | sudo -S rm -f /opt/homebrew/var/log/redis.log

# Remove Redis PID file
echo "1337!" | sudo -S rm -f /opt/homebrew/var/run/redis.pid

# Fix permissions
echo "1337!" | sudo -S chown -R $(whoami) /opt/homebrew/var/db
echo "1337!" | sudo -S chown -R $(whoami) /opt/homebrew/var/log
echo "1337!" | sudo -S chown -R $(whoami) /opt/homebrew/var/run

# Uninstall and reinstall Redis
echo "1337!" | sudo -S brew uninstall redis
echo "1337!" | sudo -S brew install redis

echo "Redis cleanup complete!"
