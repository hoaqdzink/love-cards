package com.AVi.loved_card.template.constant;

import java.util.Arrays;

/** Kiểu field tùy chỉnh trên mẫu thiệp (text, date, image, ...) — map với bảng {@code template_fields}. */
public enum FieldType {
    TEXT("text"),
    DATE("date"),
    TIME("time"),
    TEXTAREA("textarea"),
    IMAGE("image");

    private final String value;

    FieldType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static boolean isValid(String value) {
        return Arrays.stream(values()).anyMatch(type -> type.value.equals(value));
    }
}
