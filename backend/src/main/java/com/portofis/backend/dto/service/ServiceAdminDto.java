package com.portofis.backend.dto.service;

import java.time.Instant;

public record ServiceAdminDto(
        Long id,
        String slug,
        String name,
        String shortDescription,
        String description,
        String iconKey,
        Integer displayOrder,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
}
