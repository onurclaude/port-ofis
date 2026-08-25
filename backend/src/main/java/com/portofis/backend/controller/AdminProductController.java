package com.portofis.backend.controller;

import com.portofis.backend.dto.common.PageResponse;
import com.portofis.backend.dto.product.ProductAdminDto;
import com.portofis.backend.dto.product.ProductRequest;
import com.portofis.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductAdminDto>> findAll(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.findAllForAdmin(categoryId, page, size));
    }

    @PostMapping
    public ResponseEntity<ProductAdminDto> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductAdminDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findByIdForAdmin(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductAdminDto> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
