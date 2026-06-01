package com.AVi.loved_card.template.controller;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.template.dto.response.MusicTrackResponse;
import com.AVi.loved_card.template.service.TemplateCatalogService;
import com.AVi.loved_card.template.service.TemplateFilterParser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST API thư viện nhạc nền public — lọc theo genre, chỉ trả track đang active.
 */
@RestController
@RequestMapping("/api/v1/music")
@RequiredArgsConstructor
@Tag(name = "Music", description = "Public music library APIs")
public class MusicController {

    private final TemplateCatalogService templateCatalogService;
    private final TemplateFilterParser templateFilterParser;

    @GetMapping
    @Operation(summary = "Lấy danh sách nhạc nền public")
    public AppResponse<List<MusicTrackResponse>> getMusic(
            @Parameter(description = "Thể loại nhạc", example = "romantic")
            @RequestParam(required = false) String genre
    ) {
        templateFilterParser.validateGenre(genre);
        return AppResponse.success(templateCatalogService.getMusic(genre == null ? null : genre.trim()));
    }
}
