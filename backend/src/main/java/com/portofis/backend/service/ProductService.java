package com.portofis.backend.service;

import com.portofis.backend.dto.common.PageResponse;
import com.portofis.backend.dto.common.PaginationUtil;
import com.portofis.backend.dto.product.ProductAdminDto;
import com.portofis.backend.dto.product.ProductDto;
import com.portofis.backend.dto.product.ProductRequest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.entity.ProductEntity;
import com.portofis.backend.exception.ConflictException;
import com.portofis.backend.exception.FieldValidationException;
import com.portofis.backend.exception.NotFoundException;
import com.portofis.backend.mapper.ProductMapper;
import com.portofis.backend.repository.CategoryRepository;
import com.portofis.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Order.asc("displayOrder"), Sort.Order.asc("name"));

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                           ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    public PageResponse<ProductDto> findActive(String categorySlug, int page, int size) {
        Pageable pageable = PaginationUtil.of(page, size, DEFAULT_SORT);
        Page<ProductEntity> result = (categorySlug == null || categorySlug.isBlank())
                ? productRepository.findByIsActiveTrue(pageable)
                : productRepository.findByIsActiveTrueAndCategory_Slug(categorySlug, pageable);
        return PageResponse.of(result, productMapper::toDto);
    }

    public ProductDto findActiveBySlug(String slug) {
        ProductEntity entity = productRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Ürün bulunamadı."));
        return productMapper.toDto(entity);
    }

    public PageResponse<ProductAdminDto> findAllForAdmin(Long categoryId, int page, int size) {
        Pageable pageable = PaginationUtil.of(page, size, DEFAULT_SORT);
        Page<ProductEntity> result = categoryId == null
                ? productRepository.findAll(pageable)
                : productRepository.findByCategory_Id(categoryId, pageable);
        return PageResponse.of(result, productMapper::toAdminDto);
    }

    public ProductAdminDto findByIdForAdmin(Long id) {
        return productMapper.toAdminDto(getOrThrow(id));
    }

    @Transactional
    public ProductAdminDto create(ProductRequest request) {
        CategoryEntity category = resolveCategory(request.categoryId());
        assertSlugAvailable(request.slug(), null);
        ProductEntity entity = productMapper.toEntity(request, category);
        return productMapper.toAdminDto(productRepository.save(entity));
    }

    @Transactional
    public ProductAdminDto update(Long id, ProductRequest request) {
        ProductEntity entity = getOrThrow(id);
        CategoryEntity category = resolveCategory(request.categoryId());
        assertSlugAvailable(request.slug(), id);
        productMapper.applyRequest(entity, request, category);
        // saveAndFlush forces the @PreUpdate callback (which sets updatedAt) to run
        // synchronously, so the DTO built below reflects this update, not the previous one.
        return productMapper.toAdminDto(productRepository.saveAndFlush(entity));
    }

    @Transactional
    public void delete(Long id) {
        ProductEntity entity = getOrThrow(id);
        productRepository.delete(entity);
    }

    private ProductEntity getOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ürün bulunamadı."));
    }

    private CategoryEntity resolveCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new FieldValidationException("categoryId", "Geçerli bir kategori seçiniz."));
    }

    private void assertSlugAvailable(String slug, Long excludingId) {
        boolean exists = excludingId == null
                ? productRepository.existsBySlug(slug)
                : productRepository.existsBySlugAndIdNot(slug, excludingId);
        if (exists) {
            throw new ConflictException("Bu slug zaten kullanılıyor.");
        }
    }
}
