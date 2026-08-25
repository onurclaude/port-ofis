package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import com.portofis.backend.entity.CategoryEntity;
import com.portofis.backend.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminProductApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    CategoryRepository categoryRepository;

    String token;
    Long categoryId;

    @BeforeEach
    void setUp() {
        token = createAdminAndToken("prod-admin", "password123");
        CategoryEntity category = new CategoryEntity();
        category.setSlug("prod-test-kategori");
        category.setName("Test Kategori");
        category.setDisplayOrder(1);
        category.setIsActive(true);
        categoryId = categoryRepository.save(category).getId();
    }

    @Test
    void nonExistentCategoryIdIsFieldValidationErrorNot404() throws Exception {
        String payload = """
                {
                  "categoryId": 999999,
                  "slug": "gecersiz-kategori-urun",
                  "name": "Ürün",
                  "stockStatus": "IN_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """;
        mockMvc.perform(post("/api/admin/products").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("categoryId"))
                .andExpect(jsonPath("$.fieldErrors[0].message").value("Geçerli bir kategori seçiniz."));
    }

    @Test
    void createsProductWithValidCategory() throws Exception {
        String payload = """
                {
                  "categoryId": %d,
                  "slug": "gecerli-urun",
                  "name": "Geçerli Ürün",
                  "price": 19.99,
                  "stockStatus": "IN_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """.formatted(categoryId);
        mockMvc.perform(post("/api/admin/products").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category.id").value(categoryId))
                .andExpect(jsonPath("$.price").value(19.99));
    }

    @Test
    void negativePriceIsValidationError() throws Exception {
        String payload = """
                {
                  "categoryId": %d,
                  "slug": "negatif-fiyat-urun",
                  "name": "Ürün",
                  "price": -5.00,
                  "stockStatus": "IN_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """.formatted(categoryId);
        mockMvc.perform(post("/api/admin/products").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("price"));
    }

    @Test
    void defaultAdminPageSizeIsTwenty() throws Exception {
        mockMvc.perform(get("/api/admin/products").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(20));
    }

    @Test
    void pageSizeClampedToMax100() throws Exception {
        mockMvc.perform(get("/api/admin/products").header("Authorization", "Bearer " + token).param("size", "1000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(100));
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
                {
                  "categoryId": %d,
                  "slug": "updated-at-urun",
                  "name": "Urun",
                  "price": 19.99,
                  "stockStatus": "IN_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """.formatted(categoryId);
        String createResponse = mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(createPayload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = ((Number) com.jayway.jsonpath.JsonPath.read(createResponse, "$.id")).longValue();
        String createdUpdatedAt = com.jayway.jsonpath.JsonPath.read(createResponse, "$.updatedAt");

        Thread.sleep(10);
        String update1Payload = """
                {
                  "categoryId": %d,
                  "slug": "updated-at-urun",
                  "name": "Urun Bir",
                  "price": 24.99,
                  "stockStatus": "IN_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """.formatted(categoryId);
        String put1Response = mockMvc.perform(put("/api/admin/products/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(update1Payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put1UpdatedAt = com.jayway.jsonpath.JsonPath.read(put1Response, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(put1UpdatedAt).isNotEqualTo(createdUpdatedAt);

        Thread.sleep(10);
        String update2Payload = """
                {
                  "categoryId": %d,
                  "slug": "updated-at-urun",
                  "name": "Urun Iki",
                  "price": 29.99,
                  "stockStatus": "OUT_OF_STOCK",
                  "displayOrder": 1,
                  "isActive": true
                }
                """.formatted(categoryId);
        String put2Response = mockMvc.perform(put("/api/admin/products/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(update2Payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put2UpdatedAt = com.jayway.jsonpath.JsonPath.read(put2Response, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(put2UpdatedAt).isNotEqualTo(put1UpdatedAt);

        String getResponse = mockMvc.perform(get("/api/admin/products/" + id)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String getUpdatedAt = com.jayway.jsonpath.JsonPath.read(getResponse, "$.updatedAt");

        org.assertj.core.api.Assertions.assertThat(getUpdatedAt).isEqualTo(put2UpdatedAt);
    }
}
