// Central registry of internal events (RabbitMQ topics) to keep modules decoupled.
export const EVENTS = {
  // Listings
  listingCreated: 'listing.created',
  listingPublished: 'listing.published',
  listingUpdated: 'listing.updated',
  // Stock
  stockReserved: 'stock.reserved',
  stockReleased: 'stock.released',
  stockUpdated: 'stock.updated',
  // Orders
  orderCreated: 'order.created',
  orderPaid: 'order.paid',
  orderCancelled: 'order.cancelled',
  orderDelivered: 'order.delivered',
  // Delivery
  deliveryAssigned: 'delivery.assigned',
  deliveryLocationUpdated: 'delivery.location.updated',
  deliveryCompleted: 'delivery.completed',
  // Auctions
  auctionCreated: 'auction.created',
  auctionBidPlaced: 'auction.bid.placed',
  auctionEnded: 'auction.ended',
  // Media / Moderation
  imageModerationRequest: 'image.moderation.request',
  imageModerationResult: 'image.moderation.result',
  // Notifications
  notificationSend: 'notification.send',
} as const;

export type AppEvent = (typeof EVENTS)[keyof typeof EVENTS];

