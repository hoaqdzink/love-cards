package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.HostingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Truy vấn gói hosting — chỉ expose plan đang active. */
public interface HostingPlanRepository extends JpaRepository<HostingPlan, UUID> {

    /** Catalog gói cho checkout — gói recommended lên đầu. */
    List<HostingPlan> findByActiveTrueOrderByRecommendedDescNameAsc();

    /** Validate gói user chọn khi tạo đơn. */
    Optional<HostingPlan> findByIdAndActiveTrue(UUID id);
}
