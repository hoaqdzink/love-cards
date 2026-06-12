package com.AVi.loved_card.order.security;

import com.AVi.loved_card.order.exception.OrderApiException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserContextTest {

    private final UserContext userContext = new UserContext();

    @Test
    void requireUserId_parsesValidHeader() {
        UUID id = UUID.fromString("10000000-0000-4000-8000-000000000001");
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-User-Id", id.toString());

        assertThat(userContext.requireUserId(request)).isEqualTo(id);
    }

    @Test
    void requireUserId_throwsWhenMissing() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        assertThatThrownBy(() -> userContext.requireUserId(request))
                .isInstanceOf(OrderApiException.class)
                .hasMessageContaining("X-User-Id");
    }
}
