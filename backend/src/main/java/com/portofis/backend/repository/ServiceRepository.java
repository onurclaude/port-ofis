package com.portofis.backend.repository;

import com.portofis.backend.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    List<ServiceEntity> findByIsActiveTrueOrderByDisplayOrderAscNameAsc();

    List<ServiceEntity> findAllByOrderByDisplayOrderAscNameAsc();

    Optional<ServiceEntity> findBySlugAndIsActiveTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
