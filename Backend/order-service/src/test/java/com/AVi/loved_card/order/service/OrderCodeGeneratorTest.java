package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderCodeGeneratorTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderCodeGenerator orderCodeGenerator;

    @Test
    void generate_returnsLcPrefixWithDateAndSuffix() {
        when(orderRepository.existsByOrderCode(anyString())).thenReturn(false);

        String code = orderCodeGenerator.generate();

        assertThat(code).startsWith("LC-");
        assertThat(code).matches("LC-\\d{8}-[A-Z2-9]{4}");
    }
}
