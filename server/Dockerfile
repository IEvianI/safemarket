# Étape 1 : build de l'image Node
FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier les dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier le reste du code
COPY . .

RUN npx prisma generate

# Port exposé (à adapter si ton back écoute sur un autre)
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
