package com.AVi.loved_card.template.repository;

import com.AVi.loved_card.template.entity.TemplateField;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** JPA load fields của template theo thứ tự hiển thị. */
public interface TemplateFieldRepository extends JpaRepository<TemplateField, UUID> {

    List<TemplateField> findByTemplateIdOrderByDisplayOrderAsc(UUID templateId);
}
