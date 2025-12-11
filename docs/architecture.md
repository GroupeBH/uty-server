# Architecture Uty (monolithe modulaire prêt microservices)

## Modules principaux
- Auth (JWT + refresh, rôles)
- Users (profil, KYC, devices FCM)
- Categories (arbre + attributs dynamiques)
- Listings (CRUD annonces, statut draft/published/moderation, lien médias)
- Media (upload S3, modération hook Rekognition futur)
- Cart (panier, réservations stock)
- Orders (création/annulation, paiement futur, lien livraison)
- Delivery (assignation, tracking temps réel)
- Auctions (enchères, bids, timer serveur)
- Notifications (queue interne, FCM, fallback WebSocket)
- Realtime (Socket.IO `/ws`)
- Search (filtrage texte simple, cat/price; IA plus tard)
- EventBus (RabbitMQ abstraction)

## Événements internes (topics)
- Listings: `listing.created`, `listing.published`, `listing.updated`
- Stock: `stock.reserved`, `stock.released`, `stock.updated`
- Orders: `order.created`, `order.paid`, `order.cancelled`, `order.delivered`
- Delivery: `delivery.assigned`, `delivery.location.updated`, `delivery.completed`
- Auctions: `auction.created`, `auction.bid.placed`, `auction.ended`
- Media: `image.moderation.request`, `image.moderation.result`
- Notifications: `notification.send`

## Temps réel
- Socket.IO namespace `/ws`, broadcast par RealtimeGateway.
- Canaux : stock.* , auction.* , delivery.* , notification.* (fallback FCM).

## Données (Mongo)
- users, categories, listings, media, carts, orders, deliveries, auctions, notifications.
- Redis : cache, sessions, stock réservé/temps réel.

## Stock temps réel
- Ajout panier -> `stock.reserved` (Redis)
- Commande -> `stock.updated` (Mongo persist)
- Annulation -> `stock.released`
- Diffusion WebSocket + publication EventBus pour synchro.

## Médias
- Upload vers S3 (presigned PUT recommandé).
- Enregistrement ref media en BDD, statut de modération.
- Event `image.moderation.request` pour pipeline Rekognition ultérieure.

## Dépendances infra
- MongoDB, Redis, RabbitMQ, AWS S3, FCM (optionnel au début).

## Migration microservices (future)
- Extraire modules par domaine en conservant EventBus.
- Séparer bases de données par domaine.
- Ajouter API Gateway si découplage complet.

