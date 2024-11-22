#!/bin/bash

# Configuration
REMOTE_USER="root"  # ou votre utilisateur
REMOTE_HOST="31.220.77.121"  # votre IP Contabo
REMOTE_DIR="/var/www/aiftw"
REMOTE_ENV_FILE="$REMOTE_DIR/.env.production"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Démarrage du déploiement...${NC}"

# 1. Créer le répertoire distant s'il n'existe pas
echo -e "${GREEN}📁 Création du répertoire distant...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_DIR"

# 2. Copier les fichiers du projet
echo -e "${GREEN}📦 Copie des fichiers du projet...${NC}"
rsync -avz --exclude 'node_modules' \
           --exclude '.next' \
           --exclude '.git' \
           --exclude 'venv' \
           --exclude '__pycache__' \
           ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# 3. Installation des dépendances et build sur le serveur
echo -e "${GREEN}🔧 Installation des dépendances et build...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && \
    # Installation de Docker si nécessaire
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh && \
        sh get-docker.sh && \
        rm get-docker.sh
    fi && \
    
    # Installation de Node.js si nécessaire
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
        apt-get install -y nodejs
    fi && \
    
    # Installation des dépendances Node.js
    npm install && \
    
    # Build de l'application Next.js
    npm run build && \
    
    # Build de l'image Docker pour le bot
    cd server && docker build -t aiftw-bot . && \
    
    # Créer le fichier docker-compose.yml
    cat > docker-compose.yml <<EOL
version: '3.8'

services:
  nextjs:
    container_name: aiftw-nextjs
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production

  bot:
    container_name: aiftw-bot
    image: aiftw-bot
    restart: always
    ports:
      - '8080:8080'
    environment:
      - POE_TOKEN=\${POE_TOKEN}
    env_file:
      - .env.production
EOL
"

# 4. Configuration Nginx
echo -e "${GREEN}🔒 Configuration de Nginx...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "cat > /etc/nginx/sites-available/aiftw.conf <<EOL
server {
    listen 80;
    server_name your.domain.com;  # Remplacez par votre domaine

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/bot {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
ln -sf /etc/nginx/sites-available/aiftw.conf /etc/nginx/sites-enabled/aiftw.conf && \
systemctl restart nginx"

# 5. Démarrer les conteneurs Docker
echo -e "${GREEN}🐳 Démarrage des conteneurs Docker...${NC}"
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && \
    docker-compose down && \
    docker-compose up -d"

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
