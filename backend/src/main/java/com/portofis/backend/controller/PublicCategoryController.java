package com.portofis.backend.controller;

import com.portofis.backend.dto.category.CategoryDto;
import com.portofis.backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class PublicCategoryController {

    private final CategoryService categoryService;

    public PublicCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> findAll() {
        return ResponseEntity.ok(categoryService.findAllActive());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryDto> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.findActiveBySlug(slug));
    }
}
