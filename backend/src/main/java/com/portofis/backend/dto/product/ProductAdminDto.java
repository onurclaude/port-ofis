package com.portofis.backend.dto.product;

import com.portofis.backend.dto.category.CategoryRef;
import com.portofis.backend.entity.StockStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record ProductAdminDto(
        Long id,
        String slug,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        StockStatus stockStatus,
        CategoryRef category,
        Integer displayOrder,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
