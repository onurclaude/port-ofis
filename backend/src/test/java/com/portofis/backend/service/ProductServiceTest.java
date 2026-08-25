package com.portofis.backend.service;

import com.portofis.backend.dto.product.ProductRequest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.entity.StockStatus;
import com.portofis.backend.exception.FieldValidationException;
import com.portofis.backend.mapper.CategoryMapper;
import com.portofis.backend.mapper.ProductMapper;
import com.portofis.backend.repository.CategoryRepository;
import com.portofis.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository productRepository;

    @Mock
    CategoryRepository categoryRepository;

    ProductMapper productMapper = new ProductMapper(new CategoryMapper());

    ProductService sut;

    @BeforeEach
    void setUp() {
        sut = new ProductService(productRepository, categoryRepository, productMapper);
    }

    private ProductRequest request(Long categoryId) {
        return new ProductRequest(categoryId, "urun-slug", "Ürün Adı", null, null,
                BigDecimal.TEN, StockStatus.IN_STOCK, 1, true);
    }

    @Test
    void createThrowsFieldValidationExceptionWhenCategoryDoesNotExist() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sut.create(request(999L)))
                .isInstanceOf(FieldValidationException.class)
                .satisfies(ex -> {
                    FieldValidationException fve = (FieldValidationException) ex;
                    org.assertj.core.api.Assertions.assertThat(fve.getFieldErrors()).hasSize(1);
                    org.assertj.core.api.Assertions.assertThat(fve.getFieldErrors().get(0).field()).isEqualTo("categoryId");
                    org.assertj.core.api.Assertions.assertThat(fve.getFieldErrors().get(0).message())
                            .isEqualTo("Geçerli bir kategori seçiniz.");
                });
    }

    @Test
    void createSucceedsWhenCategoryExistsAndSlugIsFree() {
        CategoryEntity category = new CategoryEntity();
        category.setId(1L);
        category.setSlug("kategori");
        category.setName("Kategori");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.existsBySlug("urun-slug")).thenReturn(false);
        when(productRepository.save(org.mockito.ArgumentMatchers.any())).thenAnswer(inv -> {
            var entity = inv.getArgument(0, com.portofis.backend.entity.ProductEntity.class);
            entity.setId(10L);
            return entity;
        });

        var result = sut.create(request(1L));

        org.assertj.core.api.Assertions.assertThat(result.id()).isEqualTo(10L);
        org.assertj.core.api.Assertions.assertThat(result.category().id()).isEqualTo(1L);
    }
}
