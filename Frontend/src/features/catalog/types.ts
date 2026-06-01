export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message?: string;
  data: T;
  timestamp: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type EventType = 'wedding' | 'birthday' | 'party' | 'other';
export type ColorTag = 'pink' | 'white' | 'gold' | 'blue' | 'purple' | 'green' | 'red';
export type TemplateSort = 'popular' | 'newest' | 'price_asc' | 'price_desc';
export type MusicGenre = 'romantic' | 'cheerful' | 'classical' | 'acoustic';

export type TemplateListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventType: EventType;
  colorTags: ColorTag[];
  price: number;
  previewUrl: string;
  thumbnailUrl?: string;
  hasMusic: boolean;
  featured: boolean;
  trending: boolean;
  viewCount: number;
  purchaseCount: number;
  createdAt: string;
};

export type TemplateField = {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: 'text' | 'date' | 'time' | 'textarea' | 'image';
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  displayOrder: number;
  validation: Record<string, unknown>;
};

export type TemplateDetail = TemplateListItem & {
  status: 'active' | 'inactive';
  assetsPath?: string;
  metadata: Record<string, unknown>;
  fields: TemplateField[];
  updatedAt: string;
};

export type TemplateCategory = {
  eventType: EventType;
  label: string;
  count: number;
};

export type MusicTrack = {
  id: string;
  title: string;
  genre: MusicGenre;
  durationSec: number;
  fileUrl: string;
  metadata: Record<string, unknown>;
};

export type TemplateFilter = {
  eventType?: EventType[];
  colors?: ColorTag[];
  sort?: TemplateSort;
  page?: number;
  size?: number;
  q?: string;
};
