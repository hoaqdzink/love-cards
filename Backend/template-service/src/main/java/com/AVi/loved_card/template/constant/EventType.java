package com.AVi.loved_card.template.constant;

import java.util.Arrays;

/** Loại sự kiện hợp lệ cho query {@code event_type} (wedding, birthday, ...). */
public enum EventType {
    WEDDING("wedding"),
    BIRTHDAY("birthday"),
    PARTY("party"),
    OTHER("other");

    private final String value;

    EventType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static boolean isValid(String value) {
        return Arrays.stream(values()).anyMatch(type -> type.value.equals(value));
    }
}
