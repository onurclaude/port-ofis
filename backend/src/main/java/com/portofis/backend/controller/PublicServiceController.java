package com.portofis.backend.controller;

import com.portofis.backend.dto.service.ServiceDto;
import com.portofis.backend.service.ServiceCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class PublicServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public PublicServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceDto>> findAll() {
        return ResponseEntity.ok(serviceCatalogService.findAllActive());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ServiceDto> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(serviceCatalogService.findActiveBySlug(slug));
    }
}
