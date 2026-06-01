package com.AVi.loved_card.template.service;

import com.AVi.loved_card.template.constant.ColorTag;
import com.AVi.loved_card.template.constant.EventType;
import com.AVi.loved_card.template.constant.MusicGenre;
import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.constant.TemplateSortOption;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.exception.TemplateApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Parse và validate query string catalog ({@code event_type}, {@code colors}, {@code sort}, {@code page}, {@code q}).
 */
@Service
public class TemplateFilterParser {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 12;
    private static final int MAX_SIZE = 100;

    public TemplateFilterRequest parse(
            String eventType,
            String colors,
            String sort,
            Integer page,
            Integer size,
            String query
    ) {
        int normalizedPage = page == null ? DEFAULT_PAGE : page;
        int normalizedSize = size == null ? DEFAULT_SIZE : size;

        if (normalizedPage < 0) {
            invalid("page phải lớn hơn hoặc bằng 0");
        }
        if (normalizedSize < 1 || normalizedSize > MAX_SIZE) {
            invalid("size phải nằm trong khoảng 1-100");
        }

        List<String> eventTypes = split(eventType);
        eventTypes.stream()
                .filter(value -> !EventType.isValid(value))
                .findFirst()
                .ifPresent(value -> invalid("event_type không hợp lệ: " + value));

        List<String> colorTags = split(colors);
        colorTags.stream()
                .filter(value -> !ColorTag.isValid(value))
                .findFirst()
                .ifPresent(value -> invalid("colors không hợp lệ: " + value));

        String normalizedSort = sort == null || sort.isBlank() ? TemplateSortOption.POPULAR.value() : sort.trim();
        if (!TemplateSortOption.isValid(normalizedSort)) {
            invalid("sort không hợp lệ: " + normalizedSort);
        }

        return new TemplateFilterRequest(
                eventTypes,
                colorTags,
                normalizedSort,
                normalizedPage,
                normalizedSize,
                query == null ? null : query.trim()
        );
    }

    public void validateGenre(String genre) {
        if (genre != null && !genre.isBlank() && !MusicGenre.isValid(genre.trim())) {
            invalid("genre không hợp lệ: " + genre);
        }
    }

    private List<String> split(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private void invalid(String message) {
        throw new TemplateApiException(TemplateErrorCode.TPL_INVALID_FILTER, message, HttpStatus.BAD_REQUEST);
    }
}
