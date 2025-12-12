export class UpdateOrderStatusDto {
  status!: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

