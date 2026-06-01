package com.AVi.loved_card.template.dto.response;

/** Nhóm theo {@code event_type} và số lượng template active — dùng cho homepage/filter chips. */
public record TemplateCategoryResponse(
        String eventType,
        String label,
        long count
) {
}
