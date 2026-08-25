package com.portofis.backend.mapper;

import com.portofis.backend.dto.product.ProductAdminDto;
import com.portofis.backend.dto.product.ProductDto;
import com.portofis.backend.dto.product.ProductRequest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    private final CategoryMapper categoryMapper;

    public ProductMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public ProductDto toDto(ProductEntity e) {
        return new ProductDto(e.getId(), e.getSlug(), e.getName(), e.getDescription(), e.getImageUrl(),
                e.getPrice(), e.getStockStatus(), categoryMapper.toRef(e.getCategory()));
    }

    public ProductAdminDto toAdminDto(ProductEntity e) {
        return new ProductAdminDto(e.getId(), e.getSlug(), e.getName(), e.getDescription(), e.getImageUrl(),
                e.getPrice(), e.getStockStatus(), categoryMapper.toRef(e.getCategory()),
                e.getDisplayOrder(), e.getIsActive(), e.getCreatedAt(), e.getUpdatedAt());
    }

    public ProductEntity toEntity(ProductRequest r, CategoryEntity category) {
        ProductEntity e = new ProductEntity();
        applyRequest(e, r, category);
        return e;
    }

    public void applyRequest(ProductEntity e, ProductRequest r, CategoryEntity category) {
        e.setCategory(category);
        e.setSlug(r.slug());
        e.setName(r.name());
        e.setDescription(r.description());
        e.setImageUrl(r.imageUrl());
        e.setPrice(r.price());
        e.setStockStatus(r.stockStatus());
        e.setDisplayOrder(r.displayOrder());
        e.setIsActive(r.isActive());
    }
}
