package com.AVi.loved_card.order.client;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

/**
 * Feign client gọi template-service — validate mẫu và lấy giá snapshot khi tạo đơn/giỏ.
 */
@FeignClient(name = "template-service")
public interface TemplateServiceClient {

    /** GET metadata mẫu theo UUID (active only trả 200). */
    @GetMapping("/api/v1/templates/id/{templateId}")
    AppResponse<TemplateSummaryDto> getTemplateById(@PathVariable("templateId") UUID templateId);
}
