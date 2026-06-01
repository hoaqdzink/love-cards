package com.AVi.loved_card.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Điểm khởi chạy Eureka Server — service registry trung tâm của hệ thống microservices.
 * <p>
 * Các service khác (api-gateway, auth-service, template-service, ...) đăng ký instance
 * tại đây khi start và định kỳ gửi heartbeat. API Gateway và các client dùng Eureka
 * để tra cứu host/port thực tế thay vì hard-code địa chỉ từng service.
 * <p>
 * Chạy mặc định tại {@code http://localhost:8761}; dashboard Eureka: {@code /}.
 * Module này không đăng ký chính nó lên registry ({@code register-with-eureka: false}).
 */
@SpringBootApplication
@EnableEurekaServer
public class ServiceDiscoveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceDiscoveryApplication.class, args);
    }
}
