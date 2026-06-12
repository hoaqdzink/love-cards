package com.AVi.loved_card.order.client;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "template-service")
public interface TemplateServiceClient {

    @GetMapping("/api/v1/templates/id/{templateId}")
    AppResponse<TemplateSummaryDto> getTemplateById(@PathVariable("templateId") UUID templateId);
}
