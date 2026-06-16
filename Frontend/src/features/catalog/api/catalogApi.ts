import { api } from '@/shared/services/api';
import type {
  ApiResponse,
  MusicTrack,
  PageResponse,
  TemplateCategory,
  TemplateDetail,
  TemplateFilter,
  TemplateListItem,
} from '@/features/catalog/types';

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

function filterToParams(filter: TemplateFilter): Record<string, unknown> {
  const priceBounds = resolvePriceBounds(filter);

  return {
    event_type: filter.eventType?.join(','),
    colors: filter.colors?.join(','),
    sort: filter.sort,
    page: filter.page,
    size: filter.size,
    q: filter.q,
    min_price: priceBounds.minPrice,
    max_price: priceBounds.maxPrice,
  };
}

function resolvePriceBounds(filter: TemplateFilter): { minPrice?: number; maxPrice?: number } {
  if (filter.minPrice != null || filter.maxPrice != null) {
    return { minPrice: filter.minPrice, maxPrice: filter.maxPrice };
  }

  switch (filter.priceRange) {
    case 'free':
      return { minPrice: 0, maxPrice: 0 };
    case 'under_50k':
      return { minPrice: 1, maxPrice: 49999 };
    case '50k_100k':
      return { minPrice: 50000, maxPrice: 100000 };
    case 'over_100k':
      return { minPrice: 100001 };
    default:
      return {};
  }
}

export const catalogApi = {
  async getTemplates(filter: TemplateFilter): Promise<PageResponse<TemplateListItem>> {
    const response = await api.get<ApiResponse<PageResponse<TemplateListItem>>>(
      '/templates',
      filterToParams(filter),
    );
    return unwrap(response);
  },

  async getFeaturedTemplates(): Promise<TemplateListItem[]> {
    const response = await api.get<ApiResponse<TemplateListItem[]>>('/templates/featured');
    return unwrap(response);
  },

  async getTrendingTemplates(): Promise<TemplateListItem[]> {
    const response = await api.get<ApiResponse<TemplateListItem[]>>('/templates/trending');
    return unwrap(response);
  },

  async getTemplateById(templateId: string): Promise<TemplateListItem> {
    const response = await api.get<ApiResponse<TemplateListItem>>(`/templates/id/${templateId}`);
    return unwrap(response);
  },

  async getTemplateDetail(slug: string, sessionId: string): Promise<TemplateDetail> {
    const response = await api.get<ApiResponse<TemplateDetail>>('/templates/' + slug, undefined, {
      'X-LC-Session-Id': sessionId,
    });
    return unwrap(response);
  },

  async getCategories(): Promise<TemplateCategory[]> {
    const response = await api.get<ApiResponse<TemplateCategory[]>>('/templates/categories');
    return unwrap(response);
  },

  async getMusic(genre?: string): Promise<MusicTrack[]> {
    const response = await api.get<ApiResponse<MusicTrack[]>>('/music', { genre });
    return unwrap(response);
  },
};
