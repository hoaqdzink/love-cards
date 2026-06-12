package com.AVi.loved_card.template.constant;

import java.util.Arrays;

/** Thể loại nhạc hợp lệ cho query {@code genre} trên API {@code /api/v1/music}. */
public enum MusicGenre {
    ROMANTIC("romantic"),
    CHEERFUL("cheerful"),
    CLASSICAL("classical"),
    ACOUSTIC("acoustic");

    private final String value;

    MusicGenre(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static boolean isValid(String value) {
        return Arrays.stream(values()).anyMatch(genre -> genre.value.equals(value));
    }
}
