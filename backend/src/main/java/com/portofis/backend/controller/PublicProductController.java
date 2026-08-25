package com.portofis.backend.controller;

import com.portofis.backend.dto.common.PageResponse;
import com.portofis.backend.dto.product.ProductDto;
import com.portofis.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class PublicProductController {

    private final ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductDto>> findAll(
            @RequestParam(required = false) String categorySlug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.findActive(categorySlug, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDto> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.findActiveBySlug(slug));
    }
}
