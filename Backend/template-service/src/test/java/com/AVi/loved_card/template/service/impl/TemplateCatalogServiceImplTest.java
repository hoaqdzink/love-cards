package com.AVi.loved_card.template.service.impl;

import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.config.TemplateCacheProperties;
import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.constant.TemplateStatus;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
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
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TemplateCatalogServiceImplTest {

    @Mock
    private TemplateJdbcRepository templateJdbcRepository;

    @Mock
    private TemplateRepository templateRepository;

    @Mock
    private TemplateFieldRepository templateFieldRepository;

    @Mock
    private MusicTrackRepository musicTrackRepository;

    @Mock
    private CacheService cacheService;

    private TemplateCatalogServiceImpl service;

    private final TemplateCacheProperties cacheProperties = new TemplateCacheProperties(
            Duration.ofMinutes(5),
            Duration.ofMinutes(10),
            Duration.ofMinutes(15),
            Duration.ofMinutes(15),
            Duration.ofMinutes(30),
            Duration.ofHours(1)
    );

    @BeforeEach
    void setUp() {
        service = new TemplateCatalogServiceImpl(
                templateJdbcRepository,
                templateRepository,
                templateFieldRepository,
                musicTrackRepository,
                new TemplateMapper(),
                cacheService,
                cacheProperties
        );
    }

    @Test
    void getTemplatesDelegatesThroughCacheWithListTtl() {
        TemplateFilterRequest filter = new TemplateFilterRequest(
                List.of("wedding"),
                List.of("pink"),
                "popular",
                0,
                12,
                "peony"
        );
        PageResponse<TemplateListItemResponse> page = PageResponse.<TemplateListItemResponse>builder()
                .content(List.of())
                .totalElements(0)
                .totalPages(0)
                .currentPage(0)
                .size(12)
                .build();
        when(cacheService.getOrLoad(
                eq("template:list:" + filter),
                any(TypeReference.class),
                eq(Duration.ofMinutes(5)),
                any()
        )).thenReturn(page);

        PageResponse<TemplateListItemResponse> result = service.getTemplates(filter);

        assertThat(result).isSameAs(page);
        verify(templateJdbcRepository, never()).findActiveTemplates(any());
    }

    @Test
    void getFeaturedAndTrendingUseExpectedCacheKeysLimitsAndTtls() {
        invokeSuppliersFromCache();
        when(templateJdbcRepository.findFeatured(6)).thenReturn(List.of());
        when(templateJdbcRepository.findTrending(4)).thenReturn(List.of());

        service.getFeaturedTemplates();
        service.getTrendingTemplates();

        verify(cacheService).getOrLoad(eq("template:featured"), any(TypeReference.class), eq(Duration.ofMinutes(15)), any());
        verify(cacheService).getOrLoad(eq("template:trending"), any(TypeReference.class), eq(Duration.ofMinutes(15)), any());
        verify(templateJdbcRepository).findFeatured(6);
        verify(templateJdbcRepository).findTrending(4);
    }

    @Test
    void getTemplateDetailIncrementsViewCountWhenViewKeyIsNew() {
        invokeSuppliersFromCache();
        Template template = activeTemplate();
        when(templateRepository.findBySlugAndDeletedAtIsNull("peony-dream")).thenReturn(Optional.of(template));
        when(cacheService.setIfAbsent("template:view:" + template.getId() + ":session:abc", Duration.ofHours(1)))
                .thenReturn(true);
        when(templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId())).thenReturn(List.of());

        TemplateDetailResponse detail = service.getTemplateDetail("peony-dream", "session:abc");

        assertThat(detail.viewCount()).isEqualTo(6);
        verify(templateJdbcRepository).incrementViewCount(template.getId());
        verify(cacheService).getOrLoad(eq("template:detail:peony-dream"), any(TypeReference.class), eq(Duration.ofMinutes(10)), any());
    }

    @Test
    void getTemplateDetailDoesNotIncrementViewCountWhenViewKeyAlreadyExists() {
        invokeSuppliersFromCache();
        Template template = activeTemplate();
        when(templateRepository.findBySlugAndDeletedAtIsNull("peony-dream")).thenReturn(Optional.of(template));
        when(cacheService.setIfAbsent("template:view:" + template.getId() + ":session:abc", Duration.ofHours(1)))
                .thenReturn(false);
        when(templateFieldRepository.findByTemplateIdOrderByDisplayOrderAsc(template.getId())).thenReturn(List.of());

        TemplateDetailResponse detail = service.getTemplateDetail("peony-dream", "session:abc");

        assertThat(detail.viewCount()).isEqualTo(5);
        verify(templateJdbcRepository, never()).incrementViewCount(any());
    }

    @Test
    void getTemplateDetailRejectsMissingAndInactiveTemplates() {
        when(templateRepository.findBySlugAndDeletedAtIsNull("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getTemplateDetail("missing", "session:abc"))
                .isInstanceOfSatisfying(TemplateApiException.class, ex -> {
                    assertThat(ex.getCode()).isEqualTo(TemplateErrorCode.TPL_NOT_FOUND);
                    assertThat(ex.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                });

        Template inactive = activeTemplate();
        inactive.setStatus(TemplateStatus.INACTIVE.value());
        when(templateRepository.findBySlugAndDeletedAtIsNull("inactive")).thenReturn(Optional.of(inactive));

        assertThatThrownBy(() -> service.getTemplateDetail("inactive", "session:abc"))
                .isInstanceOfSatisfying(TemplateApiException.class, ex -> {
                    assertThat(ex.getCode()).isEqualTo(TemplateErrorCode.TPL_INACTIVE);
                    assertThat(ex.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                });
        verify(cacheService, never()).setIfAbsent(anyString(), any());
        verify(templateJdbcRepository, never()).incrementViewCount(any());
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void invokeSuppliersFromCache() {
        when(cacheService.getOrLoad(anyString(), any(TypeReference.class), any(Duration.class), any()))
                .thenAnswer(invocation -> ((Supplier) invocation.getArgument(3)).get());
    }

    private Template activeTemplate() {
        Template template = new Template();
        template.setId(UUID.fromString("11111111-1111-4111-8111-111111111111"));
        template.setName("Peony Dream");
        template.setSlug("peony-dream");
        template.setDescription("Thiệp cưới hồng pastel");
        template.setEventType("wedding");
        template.setColorTags(List.of("pink", "white"));
        template.setPrice(99000L);
        template.setStatus(TemplateStatus.ACTIVE.value());
        template.setPreviewUrl("/api/v1/template-assets/peony-dream/preview.html");
        template.setThumbnailUrl("/api/v1/template-assets/peony-dream/thumbnail.svg");
        template.setHasMusic(true);
        template.setFeatured(true);
        template.setTrending(true);
        template.setViewCount(5L);
        template.setPurchaseCount(2L);
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        return template;
    }
}
