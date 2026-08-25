package com.portofis.backend.controller;

import com.portofis.backend.dto.settings.SiteSettingsDto;
import com.portofis.backend.service.SiteSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/site-settings")
public class AdminSiteSettingsController {

    private final SiteSettingsService siteSettingsService;

    public AdminSiteSettingsController(SiteSettingsService siteSettingsService) {
        this.siteSettingsService = siteSettingsService;
    }

    @GetMapping
    public ResponseEntity<SiteSettingsDto> get() {
        return ResponseEntity.ok(siteSettingsService.get());
    }

    @PutMapping
    public ResponseEntity<SiteSettingsDto> update(@Valid @RequestBody SiteSettingsDto dto) {
        return ResponseEntity.ok(siteSettingsService.update(dto));
    }
}
