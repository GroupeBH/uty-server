export class CreateListingDto {
  categoryId!: string;
  subCategoryId?: string;
  type!: 'product' | 'service';
  title!: string;
  description!: string;
  price!: number;
  stock?: number; // for product; ignored for service
  attributes?: Record<string, unknown>;
  mediaIds?: string[];
}

