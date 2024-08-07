## Besoins

- Node.js
- PostgreSQL
- Docker

## Installation

- git clone https://github.com/RcdsDw/bot_discord.git

- npm install

## Lancement

npm run start (si vos container sont crées)
npm run dev (lancera l'index avec nodemon)

## Configuration

Créer un fichier .env avec les variables d'environnement suivantes :

- TOKEN_BOT=TOKEN_BOT
- DATABASE_URL=DATABASE_URL
- CLIENT_ID = CLIENT_ID

## Vérification

Pour vérifier le code avant de push, lancer la commande :

npm run checkall

## Déploiement

Pour déployer sur le serveur :

- Configurer en amont vos variables secrètes Github
- Ensuite : git push < distant > < branch > (le workflow s'en chargera)

Sinon :

Supprimez le dossier .github
