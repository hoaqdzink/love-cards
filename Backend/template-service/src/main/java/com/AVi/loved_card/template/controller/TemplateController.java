package com.AVi.loved_card.template.controller;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.dto.response.TemplateCategoryResponse;
import com.AVi.loved_card.template.dto.response.TemplateDetailResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;
import com.AVi.loved_card.template.service.TemplateCatalogService;
import com.AVi.loved_card.template.service.TemplateFilterParser;
import com.AVi.loved_card.template.service.ViewIdentityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST API catalog mẫu thiệp: danh sách (lọc/sort/phân trang), featured, trending, categories, chi tiết theo slug.
 */
@RestController
@RequestMapping("/api/v1/templates")
@RequiredArgsConstructor
@Tag(name = "Templates", description = "Public template catalog APIs")
public class TemplateController {

    private final TemplateCatalogService templateCatalogService;
    private final TemplateFilterParser templateFilterParser;
    private final ViewIdentityService viewIdentityService;

    @GetMapping
    @Operation(summary = "Lấy danh sách mẫu thiệp public")
    public AppResponse<PageResponse<TemplateListItemResponse>> getTemplates(
            @Parameter(description = "Loại sự kiện, comma-separated", example = "wedding,birthday")
            @RequestParam(name = "event_type", required = false) String eventType,
            @Parameter(description = "Màu sắc, comma-separated", example = "pink,gold")
            @RequestParam(required = false) String colors,
            @Parameter(description = "Sort option", example = "popular")
            @RequestParam(required = false) String sort,
            @Parameter(description = "Trang zero-indexed", example = "0")
            @RequestParam(required = false) Integer page,
            @Parameter(description = "Số lượng mỗi trang", example = "12")
            @RequestParam(required = false) Integer size,
            @Parameter(description = "Từ khóa tìm kiếm", example = "rose")
            @RequestParam(name = "q", required = false) String query
    ) {
        var filter = templateFilterParser.parse(eventType, colors, sort, page, size, query);
        return AppResponse.success(templateCatalogService.getTemplates(filter));
    }

    @GetMapping("/featured")
    @Operation(summary = "Lấy mẫu thiệp nổi bật cho trang chủ")
    public AppResponse<List<TemplateListItemResponse>> getFeaturedTemplates() {
        return AppResponse.success(templateCatalogService.getFeaturedTemplates());
    }

    @GetMapping("/trending")
    @Operation(summary = "Lấy mẫu thiệp đang thịnh hành cho trang chủ")
    public AppResponse<List<TemplateListItemResponse>> getTrendingTemplates() {
        return AppResponse.success(templateCatalogService.getTrendingTemplates());
    }

    @GetMapping("/categories")
    @Operation(summary = "Lấy danh mục sự kiện kèm số lượng mẫu active")
    public AppResponse<List<TemplateCategoryResponse>> getCategories() {
        return AppResponse.success(templateCatalogService.getCategories());
    }

    @GetMapping("/id/{templateId}")
    @Operation(summary = "Lấy mẫu thiệp theo UUID (commerce/cart lookup)")
    public AppResponse<TemplateListItemResponse> getTemplateById(@PathVariable UUID templateId) {
        return AppResponse.success(templateCatalogService.getTemplateById(templateId));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Lấy chi tiết mẫu thiệp theo slug")
    public AppResponse<TemplateDetailResponse> getTemplateDetail(
            @PathVariable String slug,
            HttpServletRequest request
    ) {
        String viewKey = viewIdentityService.resolveViewKey(request);
        return AppResponse.success(templateCatalogService.getTemplateDetail(slug, viewKey));
    }
}
