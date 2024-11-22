# Stage de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY .env.production ./.env.production

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Stage de production
FROM node:18-alpine AS runner

WORKDIR /app

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production ./.env.production

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"]
