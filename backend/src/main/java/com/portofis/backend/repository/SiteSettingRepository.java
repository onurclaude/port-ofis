package com.portofis.backend.repository;

import com.portofis.backend.entity.SiteSettingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteSettingRepository extends JpaRepository<SiteSettingEntity, Long> {

    Optional<SiteSettingEntity> findByKey(String key);
}
