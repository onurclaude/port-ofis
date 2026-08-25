package com.portofis.backend.dto.service;

public record ServiceDto(
        Long id,
        String slug,
        String name,
        String shortDescription,
        String description,
        String iconKey,
        Integer displayOrder
) {
}
