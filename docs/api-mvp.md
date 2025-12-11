# API MVP (sans IA sur création d’annonce)

## Auth
- POST `/auth/signup` {email, password, role?}
- POST `/auth/login` {email, password}
- POST `/auth/refresh`
- POST `/auth/logout`

## Users
- GET `/users/me`
- PUT `/users/me` {profile fields}
- POST `/users/devices` {fcmToken}

## Categories
- GET `/categories`
- GET `/categories/:id` (inclut attributs dynamiques)

## Listings (manuel)
- POST `/listings` {categoryId, title, description, price, stock, attributes{}, mediaIds?}
- GET `/listings` (filters: categoryId, price range, text)
- GET `/listings/:id`
- PATCH `/listings/:id` (seller)
- PATCH `/listings/:id/status` (admin/modération)

## Media (S3)
- POST `/media/upload` -> presigned URL + metadata (type, size)
- POST `/media/confirm` {uploadId, listingId?, urls[]} pour lier
- GET `/media/:id`

## Cart
- GET `/cart`
- POST `/cart/items` {listingId, qty} -> réserve stock (`stock.reserved`)
- PATCH `/cart/items/:itemId` {qty}
- DELETE `/cart/items/:itemId`

## Orders
- POST `/orders` {items[{listingId, qty}], paymentMethod?, deliveryInfo?} -> commit stock (`stock.updated`)
- GET `/orders`
- GET `/orders/:id`
- PATCH `/orders/:id/status` (seller/admin) ex: shipped/delivered
- POST `/orders/:id/cancel` -> `stock.released`

## Delivery
- POST `/deliveries/assign` {orderId, courierId?} -> `delivery.assigned`
- PATCH `/deliveries/:id/status` {status}
- POST `/deliveries/:id/locations` {lat, lng, ts} -> `delivery.location.updated`
- GET `/deliveries/:id`

## Auctions
- POST `/auctions` {listingId, startPrice, minIncrement, endTime, buyNow?}
- POST `/auctions/:id/bids` {amount} -> `auction.bid.placed`
- GET `/auctions/:id`
- GET `/auctions/:id/bids`

## Notifications
- GET `/notifications`
- PATCH `/notifications/:id/read`
- POST `/notifications/test` (optionnel pour debug)

## Temps réel (Socket.IO `/ws`)
- `stock.updated`, `stock.reserved`, `stock.released`
- `auction.bid.placed`, `auction.ended`
- `delivery.location.updated`, `delivery.assigned`
- Notifications fallback

## Payloads clés (exemples)
- Cart item: {listingId: string, qty: number}
- Bid: {amount: number}
- Delivery location: {lat: number, lng: number, ts: number}

## Règles stock
- Réservation à l’ajout panier, expiration TTL côté Redis (à définir).
- Validation + décrément à la commande.
- Annulation libère le stock.

