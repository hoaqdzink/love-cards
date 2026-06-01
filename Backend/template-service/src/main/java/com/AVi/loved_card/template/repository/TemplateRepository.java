package com.AVi.loved_card.template.repository;

import com.AVi.loved_card.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/** JPA truy cập {@link com.AVi.loved_card.template.entity.Template} — lookup theo slug, cập nhật view count. */
public interface TemplateRepository extends JpaRepository<Template, UUID> {

    Optional<Template> findBySlugAndDeletedAtIsNull(String slug);
}
