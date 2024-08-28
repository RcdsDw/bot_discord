<div align="center">

# Kufgu Ponda le bot Discord qui coubeh !

</div>

## Technos nécessaires

![Node.js Logo](https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg) ![PostgreSQL Logo](https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg) ![Docker Logo](https://www.vectorlogo.zone/logos/docker/docker-icon.svg)<br>[Node.js](https://nodejs.org/fr/download/package-manager) [PostgreSQL](https://www.postgresql.org/download/) [Docker](https://docs.docker.com/engine/install/)

## Installation et copie

- ```git clone https://github.com/RcdsDw/bot_discord.git```

- ```npm install```

## Lancement et développement

- Si les container sont crées : ```npm run start``` sinon : ```docker compose up -d --build```

- ```npm run dev``` (lancera l'index avec nodemon)

## Configuration et environnement

- Pour les variables d'environnement, copier le fichier .env.dist et renommer en .env.
- Modifier les variables d'environnement suivantes :

- TOKEN_BOT = "mon-token-de-bot"
- CLIENT_ID = "mon-client-id"

- DATABASE_USER = "exemple-utilisateur"
- DATABASE_PASSWORD = "exemple-mot-de-passe"
- DATABASE_NAME = "exemple-nom-de-la-base"
- DATABASE_URL = "postgres://exemple-utilisateur:exemple-mot-de-passe@localhost:port-du-web/exemple-nom-de-la-base"

- PORT = "port-du-web"

## Vérification et indentation

Pour vérifier le code avant de push, lancer la commande :

```npm run checkall```

## Déploiement en continu

Pour déployer sur le serveur :

- Configurer en amont les variables secrètes Github et les clés SSH
- Ensuite : ```git push <distant> <branch>``` (voir le workflow)

Sinon :

- Supprimer le dossier .github

## En cas d'ajout de slashs commands

- Lancer le script deploy-commands.ts avec la commande ```npx ts-node deploy-commands.ts```
