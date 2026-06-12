package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.HostingPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HostingPlanRepository extends JpaRepository<HostingPlan, UUID> {

    List<HostingPlan> findByActiveTrueOrderByRecommendedDescNameAsc();

    Optional<HostingPlan> findByIdAndActiveTrue(UUID id);
}
