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
  return {
    event_type: filter.eventType?.join(','),
    colors: filter.colors?.join(','),
    sort: filter.sort,
    page: filter.page,
    size: filter.size,
    q: filter.q,
  };
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
