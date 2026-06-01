package com.AVi.loved_card.template.dto.request;

import java.util.List;

/** Tham số lọc đã chuẩn hóa sau {@link com.AVi.loved_card.template.service.TemplateFilterParser} — dùng cho JDBC query và cache key. */
public record TemplateFilterRequest(
        List<String> eventTypes,
        List<String> colors,
        String sort,
        int page,
        int size,
        String query
) {
}
