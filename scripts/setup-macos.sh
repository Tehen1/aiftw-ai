#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting AIFTW setup for macOS...${NC}"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install required packages
echo "Installing required packages..."
brew install redis docker docker-compose terraform grafana prometheus

# Create project directories
echo "Creating project directories..."
mkdir -p ~/CascadeProjects/AIFTW-Projects/aiftw-ai/{config,monitoring/{prometheus,grafana},infrastructure}

# Copy Redis configuration
echo "Configuring Redis..."
cp config/redis.optimized.conf ~/CascadeProjects/AIFTW-Projects/aiftw-ai/config/
brew services restart redis

# Start Docker services
echo "Starting Docker services..."
docker-compose -f monitoring/docker-compose.yml up -d

echo -e "${GREEN}Setup completed!${NC}"
echo "Access points:"
echo "- Grafana: http://localhost:3000"
echo "- Prometheus: http://localhost:9090"
echo "- Redis Commander: http://localhost:8081"
