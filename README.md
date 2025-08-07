# API Emraude

Une API NestJS pour Emraude

---

## Features

- Authentification
- Création de parties
- Système de progression
- Système de leaderboard
- Swagger
- MongoDB

---

## Pré-requis

Il te faut tout ça :

- Node.js 18+
- Yarn
- Docker

---

## Lancer MongoDB avec Docker

Tu peux démarrer MongoDB avec cette commande :

```bash
docker run -d \
 --name emraudedb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=root \
 -e MONGO_INITDB_ROOT_PASSWORD=root \
 mongo
```

---

## Configuration

1. Renomme .env.example en .env et adapte à ton environnement :

```bash
cp .env.example .env
```

---

## Lancer

Installe les dépendances puis démarre :

```bash
yarn install
yarn start:dev
```

L’API est ici => http://localhost:3000

---

## Swagger

Swagger se trouve ici :

http://localhost:3000/api

PS : Tu peux utiliser ton JWT directement dans Swagger

---

## Scripts utiles

# Build en production

```bash
yarn build
```

# Lancer les tests

```bash
yarn test
```

---
