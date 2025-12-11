export class UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  attributes?: Record<string, unknown>;
  mediaIds?: string[];
  status?: 'draft' | 'published' | 'moderation';
}

