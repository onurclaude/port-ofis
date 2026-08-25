package com.portofis.backend.service;

import com.portofis.backend.dto.category.CategoryAdminDto;
import com.portofis.backend.dto.category.CategoryDto;
import com.portofis.backend.dto.category.CategoryRequest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.exception.ConflictException;
import com.portofis.backend.exception.NotFoundException;
import com.portofis.backend.mapper.CategoryMapper;
import com.portofis.backend.repository.CategoryRepository;
import com.portofis.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository,
                            CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryDto> findAllActive() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAscNameAsc().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    public CategoryDto findActiveBySlug(String slug) {
        CategoryEntity entity = categoryRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Kategori bulunamadı."));
        return categoryMapper.toDto(entity);
    }

    public List<CategoryAdminDto> findAllForAdmin() {
        return categoryRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(categoryMapper::toAdminDto)
                .toList();
    }

    public CategoryAdminDto findByIdForAdmin(Long id) {
        return categoryMapper.toAdminDto(getOrThrow(id));
    }

    @Transactional
    public CategoryAdminDto create(CategoryRequest request) {
        assertSlugAvailable(request.slug(), null);
        CategoryEntity entity = categoryMapper.toEntity(request);
        return categoryMapper.toAdminDto(categoryRepository.save(entity));
    }

    @Transactional
    public CategoryAdminDto update(Long id, CategoryRequest request) {
        CategoryEntity entity = getOrThrow(id);
        assertSlugAvailable(request.slug(), id);
        categoryMapper.applyRequest(entity, request);
        // saveAndFlush forces the @PreUpdate callback (which sets updatedAt) to run
        // synchronously, so the DTO built below reflects this update, not the previous one.
        return categoryMapper.toAdminDto(categoryRepository.saveAndFlush(entity));
    }

    @Transactional
    public void delete(Long id) {
        CategoryEntity entity = getOrThrow(id);
        if (productRepository.existsByCategory_Id(id)) {
            throw new ConflictException(
                    "Bu kategoriye bağlı ürünler bulunduğu için silinemiyor. Önce ürünleri başka bir kategoriye taşıyın veya silin.");
        }
        categoryRepository.delete(entity);
    }

    private CategoryEntity getOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Kategori bulunamadı."));
    }

    private void assertSlugAvailable(String slug, Long excludingId) {
        boolean exists = excludingId == null
                ? categoryRepository.existsBySlug(slug)
                : categoryRepository.existsBySlugAndIdNot(slug, excludingId);
        if (exists) {
            throw new ConflictException("Bu slug zaten kullanılıyor.");
        }
    }
}
