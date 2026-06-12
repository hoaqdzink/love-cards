package com.AVi.loved_card.template.constant;

import java.util.Arrays;

/** Giá trị màu hợp lệ cho query {@code colors} và cột JSONB {@code color_tags} trên template. */
public enum ColorTag {
    PINK("pink"),
    WHITE("white"),
    GOLD("gold"),
    BLUE("blue"),
    PURPLE("purple"),
    GREEN("green"),
    RED("red");

    private final String value;

    ColorTag(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static boolean isValid(String value) {
        return Arrays.stream(values()).anyMatch(tag -> tag.value.equals(value));
    }
}
