export class UpdateListingDto {
  categoryId?: string;
  subCategoryId?: string;
  type?: 'product' | 'service';
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  attributes?: Record<string, unknown>;
  mediaIds?: string[];
  status?: 'draft' | 'published' | 'moderation' | 'disabled';
}

