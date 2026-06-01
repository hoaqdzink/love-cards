package com.AVi.loved_card.template.config;

import com.AVi.loved_card.common.openapi.CommonOpenApi;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình OpenAPI/Swagger: server trỏ API Gateway và ví dụ response lỗi chuẩn {@code success: false}.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI templateServiceOpenAPI(@Value("${openapi.gateway-url:http://localhost:8080}") String gatewayUrl) {
        return CommonOpenApi.serviceOpenApi(
                gatewayUrl,
                "Love Cards Template Service API",
                "Public APIs for template catalog, template preview assets, and music library."
        );
    }

    @Bean
    public OpenApiCustomizer templateErrorExamplesCustomizer() {
        return CommonOpenApi.errorExamplesCustomizer();
    }
}
