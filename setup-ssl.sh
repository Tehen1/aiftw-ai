#!/bin/bash

# Configuration
DOMAIN="aiftw.be"
EMAIL="dwtehen1@gmail.com"
CLOUDFLARE_API_KEY="zpfTMO2HiG2mlgJoQM4ZhU2B7OBwlAcs3v4QFXH8"

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔒 Configuration SSL pour $DOMAIN...${NC}"

# Se connecter au serveur et exécuter les commandes
ssh root@31.220.77.121 << 'ENDSSH'
# Installation de Certbot et le plugin Cloudflare
apt-get update
apt-get install -y certbot python3-certbot-dns-cloudflare docker.io docker-compose nginx

# Configuration de Cloudflare credentials
mkdir -p /root/.secrets/
cat > /root/.secrets/cloudflare.ini << EOL
dns_cloudflare_api_token = $CLOUDFLARE_API_KEY
EOL
chmod 600 /root/.secrets/cloudflare.ini

# Obtention du certificat SSL
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.secrets/cloudflare.ini \
  -d $DOMAIN \
  --email $EMAIL \
  --agree-tos \
  --non-interactive

# Mise à jour de la configuration Nginx
cat > /etc/nginx/sites-available/aiftw.conf << EOL
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/bot {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";
}
EOL

# Activer le site et vérifier la configuration
ln -sf /etc/nginx/sites-available/aiftw.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Installation de Docker et Docker Compose si nécessaire
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Configuration du renouvellement automatique
cat > /etc/cron.d/certbot << EOL
0 0 1 * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOL

echo -e "${GREEN}✅ Configuration SSL terminée!${NC}"
ENDSSH
