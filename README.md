## Uty Server (Monolithe modulaire NestJS)

Plateforme e-commerce Uty : annonces, panier/commande, livraison temps réel, enchères, médias S3, notifications, prêt pour évolution microservices via Event Bus (RabbitMQ) et Redis/Mongo.

### Démarrage
- Installer les dépendances : `npm install`
- Lancer en dev : `npm run start:dev`

### Architecture (aperçu)
- Modules : Auth, Users, Categories, Listings, Media, Cart, Orders, Delivery, Auctions, Notifications, Realtime, Search, EventBus.
- EventBus : registre d’événements internes (`src/event-bus/events.ts`), service à brancher sur RabbitMQ.
- Realtime : Gateway Socket.IO (`/ws`) pour stock, enchères, livraison.
- Stockage médias : AWS S3 (à configurer).

### Documents
- `docs/architecture.md` : découpage modules, événements, dépendances infra.
- `docs/api-mvp.md` : endpoints MVP et payloads attendus.

### Tests
- Unitaires : `npm test`
- E2E : `npm run test:e2e`
