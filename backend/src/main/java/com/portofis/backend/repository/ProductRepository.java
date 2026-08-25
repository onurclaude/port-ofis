package com.portofis.backend.repository;

import com.portofis.backend.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    Page<ProductEntity> findByIsActiveTrueAndCategory_Slug(String categorySlug, Pageable pageable);

    Page<ProductEntity> findByIsActiveTrue(Pageable pageable);

    Page<ProductEntity> findByCategory_Id(Long categoryId, Pageable pageable);

    Optional<ProductEntity> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByCategory_Id(Long categoryId);
}
