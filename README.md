<div align="center">

# Kufgu Ponda le bot Discord qui coubeh !

</div>

## Technos nécessaires

![Node.js Logo](https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg)![]()![PostgreSQL Logo](https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg)![]()![Docker Logo](https://www.vectorlogo.zone/logos/docker/docker-icon.svg)<br>[Node.js](https://nodejs.org/fr/download/package-manager)![]()[PostgreSQL](https://www.postgresql.org/download/)![]()[Docker](https://docs.docker.com/engine/install/)

## Installation et copie

- ```git clone https://github.com/RcdsDw/bot_discord.git```

- ```npm install```

## Lancement et développement

- Si vos container sont crées : ```npm run start``` sinon : ```docker compose up -d --build```

- ```npm run dev``` (lancera l'index avec nodemon)

## Configuration et environnement

Créer un fichier .env avec les variables d'environnement suivantes :

- TOKEN_BOT = TOKEN_BOT (Le token du bot)
- DATABASE_URL = DATABASE_URL (L'url de la base de données)
- CLIENT_ID = CLIENT_ID (Le client_id du bot)
- PORT = PORT (Pour le port du web)

## Vérification et indentation

Pour vérifier le code avant de push, lancer la commande :

```npm run checkall```

## Déploiement en continu

Pour déployer sur le serveur :

- Configurer en amont vos variables secrètes Github et vos clés SSH
- Ensuite : ```git push <distant> <branch>``` (le workflow s'en chargera)

Sinon :

- Supprimez le dossier .github
