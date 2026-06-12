package com.AVi.loved_card.template.service.impl;

import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.config.TemplateCacheProperties;
import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.constant.TemplateStatus;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.dto.response.MusicTrackResponse;
import com.AVi.loved_card.template.dto.response.TemplateCategoryResponse;
import com.AVi.loved_card.template.dto.response.TemplateDetailResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;
import com.AVi.loved_card.template.entity.Template;
import com.AVi.loved_card.template.exception.TemplateApiException;
import com.AVi.loved_card.template.mapper.TemplateMapper;
import com.AVi.loved_card.template.repository.MusicTrackRepository;
import com.AVi.loved_card.template.repository.TemplateFieldRepository;
import com.AVi.loved_card.template.repository.TemplateJdbcRepository;
import com.AVi.loved_card.template.repository.TemplateRepository;
import com.AVi.loved_card.template.service.CacheService;
import com.AVi.loved_card.template.service.TemplateCatalogService;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Triển khai catalog: Redis cache, JDBC list/filter, JPA detail + tăng view count có debounce.
 */
@Service
@RequiredArgsConstructor
public class TemplateCatalogServiceImpl implements TemplateCatalogService {

    private static final int HOMEPAGE_FEATURED_LIMIT = 6;
    private static final int HOMEPAGE_TRENDING_LIMIT = 4;

    private final TemplateJdbcRepository templateJdbcRepository;
    private final TemplateRepository templateRepository;
    private final TemplateFieldRepository templateFieldRepository;
    private final MusicTrackRepository musicTrackRepository;
    private final TemplateMapper templateMapper;
    private final CacheService cacheService;
    private final TemplateCacheProperties cacheProperties;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TemplateListItemResponse> getTemplates(TemplateFilterRequest filter) {
        String key = "template:list:" + filter;
        return cacheService.getOrLoad(
                key,
                new TypeReference<PageResponse<TemplateListItemResponse>>() {
                },
                cacheProperties.listTtl(),
                () -> templateJdbcRepository.findActiveTemplates(filter)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateListItemResponse> getFeaturedTemplates() {
        return cacheService.getOrLoad(
                "template:featured",
                new TypeReference<List<TemplateListItemResponse>>() {
                },
                cacheProperties.featuredTtl(),
                () -> templateJdbcRepository.findFeatured(HOMEPAGE_FEATURED_LIMIT)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateListItemResponse> getTrendingTemplates() {
        return cacheService.getOrLoad(
                "template:trending",
                new TypeReference<List<TemplateListItemResponse>>() {
                },
                cacheProperties.trendingTtl(),
                () -> templateJdbcRepository.findTrending(HOMEPAGE_TRENDING_LIMIT)
        );
    }

    @Override
    @Transactional
    public TemplateDetailResponse getTemplateDetail(String slug, String viewKey) {
        Template template = templateRepository.findBySlugAndDeletedAtIsNull(slug)
                .orElseThrow(() -> new TemplateApiException(
                        TemplateErrorCode.TPL_NOT_FOUND,
                        "Mẫu thiệp không tồn tại",
                        HttpStatus.NOT_FOUND
                ));

        if (!TemplateStatus.ACTIVE.value().equals(template.getStatus())) {
            throw new TemplateApiException(
                    TemplateErrorCode.TPL_INACTIVE,
                    "Mẫu thiệp không khả dụng",
                    HttpStatus.NOT_FOUND
            );
        }

        incrementViewCountIfNeeded(template, viewKey);

        String key = "template:detail:" + slug;
        return cacheService.getOrLoad(
                key,
                new TypeReference<TemplateDetailResponse>() {
                },
                cacheProperties.detailTtl(),
                () -> templateMapper.toDetail(
                        template,
                        templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId())
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateCategoryResponse> getCategories() {
        return cacheService.getOrLoad(
                "template:categories",
                new TypeReference<List<TemplateCategoryResponse>>() {
                },
                cacheProperties.categoriesTtl(),
                templateJdbcRepository::findCategories
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MusicTrackResponse> getMusic(String genre) {
        var tracks = genre == null || genre.isBlank()
                ? musicTrackRepository.findByActiveTrueOrderByTitleAsc()
                : musicTrackRepository.findByActiveTrueAndGenreOrderByTitleAsc(genre);
        return tracks.stream().map(templateMapper::toMusic).toList();
    }

    private void incrementViewCountIfNeeded(Template template, String viewKey) {
        String key = "template:view:" + template.getId() + ":" + viewKey;
        if (cacheService.setIfAbsent(key, cacheProperties.viewDedupeTtl())) {
            templateJdbcRepository.incrementViewCount(template.getId());
            template.setViewCount(template.getViewCount() == null ? 1 : template.getViewCount() + 1);
        }
    }
}
