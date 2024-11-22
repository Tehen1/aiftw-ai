#!/bin/bash

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# SSH connection details
SERVER="root@31.220.77.121"
DEPLOY_DIR="/root/aiftw"

# Build locally
echo -e "${GREEN}🔨 Building project locally...${NC}"
npm run build

# Create deployment directory
echo -e "${GREEN}📁 Creating remote directory...${NC}"
ssh $SERVER "mkdir -p $DEPLOY_DIR"

# Copy files to server
echo -e "${GREEN}📦 Copying project files...${NC}"
rsync -azP --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env.local' \
    ./ $SERVER:$DEPLOY_DIR/

# Install dependencies and start server
echo -e "${GREEN}🔧 Installing dependencies and starting server...${NC}"
ssh $SERVER "cd $DEPLOY_DIR && \
    npm install && \
    pm2 delete aiftw || true && \
    PORT=3000 pm2 start npm --name aiftw -- start"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
