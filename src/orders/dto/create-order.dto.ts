export class CreateOrderDto {
  items!: { listingId: string; qty: number }[];
  paymentMethod?: string;
  deliveryInfo?: Record<string, unknown>;
}

