package com.AVi.loved_card.template.constant;

/** Trạng thái xuất bản template — API public chỉ trả {@link #ACTIVE}. */
public enum TemplateStatus {
    ACTIVE("active"),
    INACTIVE("inactive");

    private final String value;

    TemplateStatus(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
