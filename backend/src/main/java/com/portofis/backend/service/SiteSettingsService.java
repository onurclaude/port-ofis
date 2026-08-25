package com.portofis.backend.service;

import com.portofis.backend.dto.settings.SiteSettingsDto;
import com.portofis.backend.entity.SiteSettingEntity;
import com.portofis.backend.mapper.SiteSettingsMapper;
import com.portofis.backend.repository.SiteSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SiteSettingsService {

    private final SiteSettingRepository siteSettingRepository;
    private final SiteSettingsMapper siteSettingsMapper;

    public SiteSettingsService(SiteSettingRepository siteSettingRepository, SiteSettingsMapper siteSettingsMapper) {
        this.siteSettingRepository = siteSettingRepository;
        this.siteSettingsMapper = siteSettingsMapper;
    }

    public SiteSettingsDto get() {
        Map<String, String> values = siteSettingRepository.findAll().stream()
                .collect(Collectors.toMap(SiteSettingEntity::getKey, e -> e.getValue() == null ? "" : e.getValue()));
        return siteSettingsMapper.toDto(values);
    }

    @Transactional
    public SiteSettingsDto update(SiteSettingsDto dto) {
        Map<String, String> newValues = siteSettingsMapper.toKeyValueMap(dto);
        for (String key : SiteSettingsMapper.ALL_KEYS) {
            SiteSettingEntity entity = siteSettingRepository.findByKey(key).orElseGet(() -> {
                SiteSettingEntity e = new SiteSettingEntity();
                e.setKey(key);
                return e;
            });
            entity.setValue(newValues.get(key));
            siteSettingRepository.save(entity);
        }
        return get();
    }
}
