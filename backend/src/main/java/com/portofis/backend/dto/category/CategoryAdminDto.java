package com.portofis.backend.dto.category;

import java.time.Instant;

public record CategoryAdminDto(
        Long id,
        String slug,
        String name,
        String description,
        String imageUrl,
        Integer displayOrder,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
