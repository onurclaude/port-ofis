package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.entity.ProductEntity;
import com.portofis.backend.entity.StockStatus;
import com.portofis.backend.repository.CategoryRepository;
import com.portofis.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminCategoryApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    String token;

    @BeforeEach
    void setUp() {
        token = createAdminAndToken("cat-admin", "password123");
    }

    @Test
    void deletingCategoryWithoutProductsSucceeds() throws Exception {
        CategoryEntity category = new CategoryEntity();
        category.setSlug("bos-kategori");
        category.setName("Boş Kategori");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        category = categoryRepository.save(category);

        mockMvc.perform(delete("/api/admin/categories/" + category.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void deletingCategoryWithProductsReturnsConflict() throws Exception {
        CategoryEntity category = new CategoryEntity();
        category.setSlug("dolu-kategori");
        category.setName("Dolu Kategori");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        category = categoryRepository.save(category);

        ProductEntity product = new ProductEntity();
        product.setCategory(category);
        product.setSlug("dolu-kategori-urun");
        product.setName("Ürün");
        product.setStockStatus(StockStatus.IN_STOCK);
        product.setDisplayOrder(1);
        product.setIsActive(true);
        productRepository.save(product);

        mockMvc.perform(delete("/api/admin/categories/" + category.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value(
                        "Bu kategoriye bağlı ürünler bulunduğu için silinemiyor. Önce ürünleri başka bir kategoriye taşıyın veya silin."));
    }

    @Test
    void createDuplicateCategorySlugReturnsConflict() throws Exception {
        String payload = """
                { "slug": "cat-dup", "name": "Kategori", "displayOrder": 1, "isActive": true }
                """;
        mockMvc.perform(post("/api/admin/categories").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/admin/categories").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isConflict());
    }

    @Test
    void invalidImageUrlIsValidationError() throws Exception {
        String payload = """
                { "slug": "cat-bad-url", "name": "Kategori", "imageUrl": "not-a-url", "displayOrder": 1, "isActive": true }
                """;
        mockMvc.perform(post("/api/admin/categories").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("imageUrl"));
    }

    /**
     * Regression test for BUG-004: the PUT response's updatedAt must reflect the update just
     * performed (not the previous revision) and must match what an immediate follow-up GET
     * returns. Root cause was @PreUpdate firing only at flush time, after the DTO had already
     * been built from the stale in-memory entity; fixed via saveAndFlush in the service layer.
     */
    @Test
    void putResponseUpdatedAtReflectsThisUpdateNotThePreviousOne() throws Exception {
        String createPayload = """
                { "slug": "updated-at-cat", "name": "Kategori", "displayOrder": 1, "isActive": true }
                """;
        String createResponse = mockMvc.perform(post("/api/admin/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(createPayload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = ((Number) com.jayway.jsonpath.JsonPath.read(createResponse, "$.id")).longValue();
        String createdUpdatedAt = com.jayway.jsonpath.JsonPath.read(createResponse, "$.updatedAt");

        Thread.sleep(10);
        String update1Payload = """
                { "slug": "updated-at-cat", "name": "Kategori Bir", "displayOrder": 1, "isActive": true }
                """;
        String put1Response = mockMvc.perform(put("/api/admin/categories/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(update1Payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put1UpdatedAt = com.jayway.jsonpath.JsonPath.read(put1Response, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(put1UpdatedAt).isNotEqualTo(createdUpdatedAt);

        Thread.sleep(10);
        String update2Payload = """
                { "slug": "updated-at-cat", "name": "Kategori Iki", "displayOrder": 1, "isActive": true }
                """;
        String put2Response = mockMvc.perform(put("/api/admin/categories/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(update2Payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put2UpdatedAt = com.jayway.jsonpath.JsonPath.read(put2Response, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(put2UpdatedAt).isNotEqualTo(put1UpdatedAt);

        String getResponse = mockMvc.perform(get("/api/admin/categories/" + id)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String getUpdatedAt = com.jayway.jsonpath.JsonPath.read(getResponse, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(getUpdatedAt).isEqualTo(put2UpdatedAt);
    }
}
