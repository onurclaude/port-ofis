package com.portofis.backend.dto.category;

public record CategoryDto(
        Long id,
        String slug,
        String name,
        String description,
        String imageUrl,
        Integer displayOrder
) {
}
