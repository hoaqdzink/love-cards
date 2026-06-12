package com.AVi.loved_card.template.service;

import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.exception.TemplateApiException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TemplateFilterParserTest {

    private final TemplateFilterParser parser = new TemplateFilterParser();

    @Test
    void parseAppliesDefaultsAndTrimsQuery() {
        TemplateFilterRequest filter = parser.parse(null, null, null, null, null, "  hoa cưới  ");

        assertThat(filter.eventTypes()).isEmpty();
        assertThat(filter.colors()).isEmpty();
        assertThat(filter.sort()).isEqualTo("popular");
        assertThat(filter.page()).isZero();
        assertThat(filter.size()).isEqualTo(12);
        assertThat(filter.query()).isEqualTo("hoa cưới");
    }

    @Test
    void parseSplitsTrimsAndDeduplicatesFilters() {
        TemplateFilterRequest filter = parser.parse(
                " wedding, birthday, wedding ",
                " pink, white, pink ",
                "price_asc",
                2,
                24,
                null
        );

        assertThat(filter.eventTypes()).containsExactly("wedding", "birthday");
        assertThat(filter.colors()).containsExactly("pink", "white");
        assertThat(filter.sort()).isEqualTo("price_asc");
        assertThat(filter.page()).isEqualTo(2);
        assertThat(filter.size()).isEqualTo(24);
    }

    @Test
    void parseRejectsInvalidPagingAndFilterValues() {
        assertInvalidFilter(() -> parser.parse(null, null, null, -1, 12, null), "page");
        assertInvalidFilter(() -> parser.parse(null, null, null, 0, 101, null), "size");
        assertInvalidFilter(() -> parser.parse("graduation", null, null, 0, 12, null), "event_type");
        assertInvalidFilter(() -> parser.parse(null, "black", null, 0, 12, null), "colors");
        assertInvalidFilter(() -> parser.parse(null, null, "random", 0, 12, null), "sort");
    }

    @Test
    void validateGenreAcceptsBlankAndKnownGenres() {
        parser.validateGenre(null);
        parser.validateGenre(" ");
        parser.validateGenre("romantic");
    }

    @Test
    void validateGenreRejectsUnknownGenre() {
        assertInvalidFilter(() -> parser.validateGenre("lofi"), "genre");
    }

    private void assertInvalidFilter(Runnable action, String messagePart) {
        assertThatThrownBy(action::run)
                .isInstanceOfSatisfying(TemplateApiException.class, ex -> {
                    assertThat(ex.getCode()).isEqualTo(TemplateErrorCode.TPL_INVALID_FILTER);
                    assertThat(ex.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(ex.getMessage()).contains(messagePart);
                });
    }
}
