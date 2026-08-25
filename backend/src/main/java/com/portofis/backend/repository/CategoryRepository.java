package com.portofis.backend.repository;

import com.portofis.backend.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    List<CategoryEntity> findByIsActiveTrueOrderByDisplayOrderAscNameAsc();

    List<CategoryEntity> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<CategoryEntity> findBySlugAndIsActiveTrue(String slug);

    Optional<CategoryEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
