export class CreateAuctionDto {
  listingId!: string;
  startPrice!: number;
  minIncrement!: number;
  endTime!: Date;
  buyNow?: number;
}

