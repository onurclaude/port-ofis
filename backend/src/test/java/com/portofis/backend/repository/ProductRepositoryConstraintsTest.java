package com.portofis.backend.repository;

import com.portofis.backend.AbstractIntegrationTest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.entity.ProductEntity;
import com.portofis.backend.entity.StockStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Repository/integration tests that exercise the DB-level constraints from
 * docs/DATABASE_SCHEMA.md against a real PostgreSQL instance (Testcontainers) — these are
 * things Bean Validation alone cannot prove, since they must actually be enforced by
 * the schema Flyway created (V1__create_initial_schema.sql), not just by application code.
 */
class ProductRepositoryConstraintsTest extends AbstractIntegrationTest {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void duplicateSlugViolatesUniqueConstraint() {
        CategoryEntity category = new CategoryEntity();
        category.setSlug("constraint-test-category");
        category.setName("Test");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        category = categoryRepository.saveAndFlush(category);

        ProductEntity first = newProduct(category, "duplicate-slug-test");
        productRepository.saveAndFlush(first);

        ProductEntity second = newProduct(category, "duplicate-slug-test");

        assertThatThrownBy(() -> productRepository.saveAndFlush(second))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void categoryWithProductsCannotBeDeletedAtDbLevelOnDeleteRestrict() {
        CategoryEntity category = new CategoryEntity();
        category.setSlug("restrict-test-category");
        category.setName("Test");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        category = categoryRepository.saveAndFlush(category);

        ProductEntity product = newProduct(category, "restrict-test-product");
        productRepository.saveAndFlush(product);

        // Deleted via a plain SQL statement (not the JPA repository) so this proves the
        // database schema itself enforces ON DELETE RESTRICT (V1__create_initial_schema.sql),
        // independent of Hibernate's own in-memory transient-reference checks, which would
        // otherwise short-circuit the delete before it ever reaches the database.
        Long categoryId = category.getId();
        assertThatThrownBy(() -> jdbcTemplate.update("DELETE FROM categories WHERE id = ?", categoryId))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void stockStatusCheckConstraintRejectsUnknownValue() {
        CategoryEntity category = new CategoryEntity();
        category.setSlug("check-constraint-category");
        category.setName("Test");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        category = categoryRepository.saveAndFlush(category);
        Long categoryId = category.getId();

        assertThatThrownBy(() -> jdbcTemplate.update(
                "INSERT INTO products (category_id, slug, name, stock_status, display_order, is_active) "
                        + "VALUES (?, 'bad-stock-status-product', 'X', 'NOT_A_REAL_STATUS', 0, true)",
                categoryId))
                .isInstanceOf(org.springframework.dao.DataAccessException.class);
    }

    private ProductEntity newProduct(CategoryEntity category, String slug) {
        ProductEntity p = new ProductEntity();
        p.setCategory(category);
        p.setSlug(slug);
        p.setName("Ürün");
        p.setStockStatus(StockStatus.IN_STOCK);
        p.setDisplayOrder(1);
        p.setIsActive(true);
        return p;
    }
}
