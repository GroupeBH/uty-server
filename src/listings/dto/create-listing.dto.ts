export class CreateListingDto {
  categoryId!: string;
  title!: string;
  description!: string;
  price!: number;
  stock!: number;
  attributes?: Record<string, unknown>;
  mediaIds?: string[];
}

