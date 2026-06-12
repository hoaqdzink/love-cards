package com.AVi.loved_card.template.service;

import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.dto.response.MusicTrackResponse;
import com.AVi.loved_card.template.dto.response.TemplateCategoryResponse;
import com.AVi.loved_card.template.dto.response.TemplateDetailResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;

import java.util.List;
import java.util.UUID;

/** Hợp đồng nghiệp vụ catalog Phase 1 — list, detail, featured, trending, categories, music. */
public interface TemplateCatalogService {

    PageResponse<TemplateListItemResponse> getTemplates(TemplateFilterRequest filter);

    List<TemplateListItemResponse> getFeaturedTemplates();

    List<TemplateListItemResponse> getTrendingTemplates();

    TemplateDetailResponse getTemplateDetail(String slug, String viewKey);

    List<TemplateCategoryResponse> getCategories();

    List<MusicTrackResponse> getMusic(String genre);

    TemplateListItemResponse getTemplateById(UUID templateId);
}
