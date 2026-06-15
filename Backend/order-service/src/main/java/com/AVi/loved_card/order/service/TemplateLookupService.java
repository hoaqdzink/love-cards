package com.AVi.loved_card.order.service;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.client.TemplateServiceClient;
import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.dto.response.TemplateLineResponse;
import com.AVi.loved_card.order.exception.OrderApiException;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Gọi template-service (Feign) — validate mẫu active và map sang DTO dòng giỏ/đơn.
 */
@Service
@RequiredArgsConstructor
public class TemplateLookupService {

    private final TemplateServiceClient templateServiceClient;

    /**
     * Lấy metadata mẫu; ném {@code ORD_TEMPLATE_UNAVAILABLE} / {@code CART_TEMPLATE_*} nếu lỗi.
     */
    public TemplateSummaryDto requireActiveTemplate(UUID templateId) {
        try {
            AppResponse<TemplateSummaryDto> response = templateServiceClient.getTemplateById(templateId);
            if (response == null || !response.isSuccess() || response.getData() == null) {
                throw unavailable(templateId);
            }
            return response.getData();
        } catch (FeignException.NotFound ex) {
            throw new OrderApiException(
                    OrderErrorCode.CART_TEMPLATE_NOT_FOUND,
                    "Mẫu thiệp không tồn tại",
                    HttpStatus.NOT_FOUND
            );
        } catch (FeignException.BadRequest ex) {
            // Template-service trả 400 khi status inactive
            throw new OrderApiException(
                    OrderErrorCode.CART_TEMPLATE_INACTIVE,
                    "Mẫu thiệp không còn khả dụng",
                    HttpStatus.BAD_REQUEST
            );
        } catch (OrderApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw unavailable(templateId);
        }
    }

    /** Map summary → dòng hiển thị trên cart/order response. */
    public TemplateLineResponse toLine(TemplateSummaryDto template) {
        return new TemplateLineResponse(
                template.id(),
                template.name(),
                template.slug(),
                template.price(),
                template.thumbnailUrl()
        );
    }

    private OrderApiException unavailable(UUID templateId) {
        return new OrderApiException(
                OrderErrorCode.ORD_TEMPLATE_UNAVAILABLE,
                "Mẫu không còn khả dụng: " + templateId,
                HttpStatus.BAD_REQUEST
        );
    }
}
