package com.portofis.backend.controller;

import com.portofis.backend.dto.service.ServiceAdminDto;
import com.portofis.backend.dto.service.ServiceRequest;
import com.portofis.backend.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
public class AdminServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public AdminServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceAdminDto>> findAll() {
        return ResponseEntity.ok(serviceCatalogService.findAllForAdmin());
    }

    @PostMapping
    public ResponseEntity<ServiceAdminDto> create(@Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceCatalogService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceAdminDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCatalogService.findByIdForAdmin(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceAdminDto> update(@PathVariable Long id, @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceCatalogService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCatalogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
