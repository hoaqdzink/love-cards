package com.AVi.loved_card.template.constant;

import java.util.Arrays;

/** Tùy chọn sắp xếp catalog ({@code sort}) kèm mệnh đề SQL {@code ORDER BY} tương ứng. */
public enum TemplateSortOption {
    POPULAR("popular", "purchase_count DESC, view_count DESC, created_at DESC"),
    NEWEST("newest", "created_at DESC"),
    PRICE_ASC("price_asc", "price ASC, created_at DESC"),
    PRICE_DESC("price_desc", "price DESC, created_at DESC");

    private final String value;
    private final String orderBy;

    TemplateSortOption(String value, String orderBy) {
        this.value = value;
        this.orderBy = orderBy;
    }

    public String value() {
        return value;
    }

    public String orderBy() {
        return orderBy;
    }

    public static TemplateSortOption from(String value) {
        return Arrays.stream(values())
                .filter(option -> option.value.equals(value))
                .findFirst()
                .orElse(POPULAR);
    }

    public static boolean isValid(String value) {
        return Arrays.stream(values()).anyMatch(option -> option.value.equals(value));
    }
}
