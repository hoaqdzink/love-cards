package com.AVi.loved_card.template.controller;

import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.dto.response.MusicTrackResponse;
import com.AVi.loved_card.template.dto.response.TemplateAssetResponse;
import com.AVi.loved_card.template.dto.response.TemplateDetailResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;
import com.AVi.loved_card.template.exception.TemplateApiException;
import com.AVi.loved_card.template.exception.TemplateExceptionHandler;
import com.AVi.loved_card.template.service.TemplateAssetService;
import com.AVi.loved_card.template.service.TemplateCatalogService;
import com.AVi.loved_card.template.service.TemplateFilterParser;
import com.AVi.loved_card.template.service.ViewIdentityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TemplateControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TemplateCatalogService templateCatalogService;

    @Mock
    private TemplateFilterParser templateFilterParser;

    @Mock
    private ViewIdentityService viewIdentityService;

    @Mock
    private TemplateAssetService templateAssetService;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(
                        new TemplateController(templateCatalogService, templateFilterParser, viewIdentityService),
                        new MusicController(templateCatalogService, templateFilterParser),
                        new TemplateAssetController(templateAssetService)
                )
                .setControllerAdvice(new TemplateExceptionHandler())
                .build();
    }

    @Test
    void getTemplatesReturnsPaginatedCatalogResponse() throws Exception {
        TemplateFilterRequest filter = new TemplateFilterRequest(
                List.of("wedding"),
                List.of("pink"),
                "popular",
                0,
                1,
                "rose"
        );
        when(templateFilterParser.parse("wedding", "pink", "popular", 0, 1, "rose")).thenReturn(filter);
        when(templateCatalogService.getTemplates(filter)).thenReturn(PageResponse.<TemplateListItemResponse>builder()
                .content(List.of(listItem()))
                .totalElements(1)
                .totalPages(1)
                .currentPage(0)
                .size(1)
                .build());

        mockMvc.perform(get("/api/v1/templates")
                        .param("event_type", "wedding")
                        .param("colors", "pink")
                        .param("sort", "popular")
                        .param("page", "0")
                        .param("size", "1")
                        .param("q", "rose"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].slug").value("peony-dream"))
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.currentPage").value(0));
    }

    @Test
    void getTemplatesReturnsTemplateErrorForInvalidFilter() throws Exception {
        when(templateFilterParser.parse(eq("invalid"), any(), any(), any(), any(), any()))
                .thenThrow(new TemplateApiException(
                        TemplateErrorCode.TPL_INVALID_FILTER,
                        "event_type không hợp lệ: invalid",
                        HttpStatus.BAD_REQUEST
                ));

        mockMvc.perform(get("/api/v1/templates").param("event_type", "invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(TemplateErrorCode.TPL_INVALID_FILTER))
                .andExpect(jsonPath("$.message").value("event_type không hợp lệ: invalid"));
    }

    @Test
    void getTemplateDetailUsesResolvedViewKey() throws Exception {
        when(viewIdentityService.resolveViewKey(any())).thenReturn("session:abc");
        when(templateCatalogService.getTemplateDetail("peony-dream", "session:abc")).thenReturn(detail());

        mockMvc.perform(get("/api/v1/templates/peony-dream")
                        .header("X-LC-Session-Id", "abc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("peony-dream"))
                .andExpect(jsonPath("$.data.fields").isArray());

        verify(templateCatalogService).getTemplateDetail("peony-dream", "session:abc");
    }

    @Test
    void getMusicValidatesAndTrimsGenreBeforeQueryingService() throws Exception {
        when(templateCatalogService.getMusic("romantic")).thenReturn(List.of(new MusicTrackResponse(
                UUID.fromString("01010101-0101-4101-8101-010101010101"),
                "Soft Romance",
                "romantic",
                126,
                "/api/v1/template-assets/peony-dream/preview.html",
                Map.of("artist", "Love Cards Demo")
        )));

        mockMvc.perform(get("/api/v1/music").param("genre", " romantic "))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("Soft Romance"))
                .andExpect(jsonPath("$.data[0].genre").value("romantic"));

        verify(templateFilterParser).validateGenre(" romantic ");
        verify(templateCatalogService).getMusic("romantic");
    }

    @Test
    void getTemplateAssetStreamsBytesWithCacheHeaders() throws Exception {
        when(templateAssetService.getAsset("peony-dream", "preview.html"))
                .thenReturn(new TemplateAssetResponse("<html>ok</html>".getBytes(), "text/html"));

        mockMvc.perform(get("/api/v1/template-assets/peony-dream/preview.html"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.TEXT_HTML))
                .andExpect(header().string("Cache-Control", "max-age=900, public"))
                .andExpect(content().string("<html>ok</html>"));
    }

    private TemplateListItemResponse listItem() {
        return new TemplateListItemResponse(
                UUID.fromString("11111111-1111-4111-8111-111111111111"),
                "Peony Dream",
                "peony-dream",
                "Thiệp cưới hồng pastel",
                "wedding",
                List.of("pink", "white"),
                99000L,
                "/api/v1/template-assets/peony-dream/preview.html",
                "/api/v1/template-assets/peony-dream/thumbnail.svg",
                true,
                true,
                true,
                5L,
                2L,
                LocalDateTime.of(2026, 5, 25, 9, 0)
        );
    }

    private TemplateDetailResponse detail() {
        TemplateListItemResponse item = listItem();
        return new TemplateDetailResponse(
                item.id(),
                item.name(),
                item.slug(),
                item.description(),
                item.eventType(),
                item.colorTags(),
                item.price(),
                "active",
                item.previewUrl(),
                item.thumbnailUrl(),
                "public/templates/peony-dream",
                true,
                true,
                true,
                item.viewCount(),
                item.purchaseCount(),
                Map.of(),
                List.of(),
                item.createdAt(),
                item.createdAt()
        );
    }
}
