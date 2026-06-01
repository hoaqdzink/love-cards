package com.AVi.loved_card.common.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;

import java.util.List;
import java.util.Map;

public final class CommonOpenApi {

    private CommonOpenApi() {
    }

    public static OpenAPI serviceOpenApi(String gatewayUrl, String title, String description) {
        return new OpenAPI()
                .servers(List.of(new Server().url(gatewayUrl).description("API Gateway")))
                .info(new Info()
                        .title(title)
                        .version("1.0.0")
                        .description(description));
    }

    public static OpenApiCustomizer errorExamplesCustomizer() {
        return openApi -> openApi.getPaths().values().forEach(pathItem ->
                pathItem.readOperations().forEach(operation ->
                        operation.getResponses().forEach((status, response) -> {
                            if (!status.startsWith("2")) {
                                applyErrorExample(response, status);
                            }
                        })));
    }

    private static void applyErrorExample(ApiResponse response, String status) {
        var error = errorForStatus(status);
        response.content(new Content().addMediaType("application/json", new MediaType()
                .example(Map.of(
                        "success", false,
                        "code", error.code(),
                        "message", error.message(),
                        "timestamp", "2026-05-25T09:37:27.647Z"
                ))));
    }

    private static ErrorExample errorForStatus(String status) {
        return switch (status.charAt(0)) {
            case '3' -> new ErrorExample("REDIRECTION", "Yêu cầu được chuyển hướng");
            case '4' -> new ErrorExample("REQUEST_ERROR", "Yêu cầu không hợp lệ hoặc không thể xử lý");
            case '5' -> new ErrorExample("INTERNAL_ERROR", "An unexpected error occurred");
            default -> new ErrorExample("ERROR", "Request failed");
        };
    }

    private record ErrorExample(String code, String message) {
    }
}
