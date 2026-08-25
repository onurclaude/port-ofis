package com.portofis.backend.mapper;

import com.portofis.backend.dto.category.CategoryAdminDto;
import com.portofis.backend.dto.category.CategoryDto;
import com.portofis.backend.dto.category.CategoryRef;
import com.portofis.backend.dto.category.CategoryRequest;
import com.portofis.backend.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toDto(CategoryEntity e) {
        return new CategoryDto(e.getId(), e.getSlug(), e.getName(), e.getDescription(),
                e.getImageUrl(), e.getDisplayOrder());
    }

    public CategoryAdminDto toAdminDto(CategoryEntity e) {
        return new CategoryAdminDto(e.getId(), e.getSlug(), e.getName(), e.getDescription(),
                e.getImageUrl(), e.getDisplayOrder(), e.getIsActive(), e.getCreatedAt(), e.getUpdatedAt());
    }

    public CategoryRef toRef(CategoryEntity e) {
        return new CategoryRef(e.getId(), e.getSlug(), e.getName());
    }

    public CategoryEntity toEntity(CategoryRequest r) {
        CategoryEntity e = new CategoryEntity();
        applyRequest(e, r);
        return e;
    }

    public void applyRequest(CategoryEntity e, CategoryRequest r) {
        e.setSlug(r.slug());
        e.setName(r.name());
        e.setDescription(r.description());
        e.setImageUrl(r.imageUrl());
        e.setDisplayOrder(r.displayOrder());
        e.setIsActive(r.isActive());
    }
}
