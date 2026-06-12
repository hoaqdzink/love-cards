package com.AVi.loved_card.template.dto.response;

import java.util.Map;
import java.util.UUID;

/** Mô tả một ô nhập trên form tạo thiệp — map từ {@link com.AVi.loved_card.template.entity.TemplateField}. */
public record TemplateFieldResponse(
        UUID id,
        String fieldKey,
        String fieldLabel,
        String fieldType,
        String placeholder,
        Boolean required,
        Integer maxLength,
        Integer displayOrder,
        Map<String, Object> validation
) {
}
