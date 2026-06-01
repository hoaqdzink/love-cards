package com.AVi.loved_card.notification.config;

import com.AVi.loved_card.common.openapi.CommonOpenApi;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI notificationServiceOpenAPI(@Value("${openapi.gateway-url:http://localhost:8080}") String gatewayUrl) {
        return CommonOpenApi.serviceOpenApi(
                gatewayUrl,
                "Love Cards Notification Service API",
                "Email, newsletter, and notification APIs."
        );
    }

    @Bean
    public OpenApiCustomizer notificationErrorExamplesCustomizer() {
        return CommonOpenApi.errorExamplesCustomizer();
    }
}
