package com.AVi.loved_card.template;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Điểm khởi chạy template-service — microservice catalog mẫu thiệp (Phase 1).
 * <p>
 * Cung cấp API public: danh sách/chi tiết template, category, nhạc nền, asset preview.
 * Dùng schema PostgreSQL {@code catalog}, Redis cache, MinIO cho file demo, đăng ký Eureka.
 */
@SpringBootApplication(scanBasePackages = "com.AVi.loved_card")
public class TemplateServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TemplateServiceApplication.class, args);
    }
}
