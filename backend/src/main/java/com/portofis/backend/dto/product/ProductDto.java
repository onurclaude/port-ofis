package com.portofis.backend.dto.product;

import com.portofis.backend.dto.category.CategoryRef;
import com.portofis.backend.entity.StockStatus;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String slug,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        StockStatus stockStatus,
        CategoryRef category
) {
}
