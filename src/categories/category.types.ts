export type CategoryAttributeType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object';

export type CategoryAttribute = {
  key: string;
  label: string;
  type: CategoryAttributeType;
  required?: boolean;
  options?: string[]; // for enum/select
  unit?: string;
};

