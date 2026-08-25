package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PublicProductApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void defaultPageSizeIsTwelve() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(12))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.totalElements").value(12));
    }

    @Test
    void unknownCategorySlugReturnsEmptyContentNot4xx() throws Exception {
        mockMvc.perform(get("/api/products").param("categorySlug", "does-not-exist"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void filtersByCategorySlug() throws Exception {
        mockMvc.perform(get("/api/products").param("categorySlug", "toner-kartus"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].category.slug").value("toner-kartus"));
    }

    @Test
    void findsBySlugWithNullPrice() throws Exception {
        mockMvc.perform(get("/api/products/kisiye-ozel-kupa-baski"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value((Object) null))
                .andExpect(jsonPath("$.stockStatus").value("IN_STOCK"));
    }

    @Test
    void returns404ForUnknownSlug() throws Exception {
        mockMvc.perform(get("/api/products/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    @Test
    void malformedPageParamIsBadRequest() throws Exception {
        mockMvc.perform(get("/api/products").param("page", "not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    void sizeIsClampedToMax100() throws Exception {
        mockMvc.perform(get("/api/products").param("size", "500"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(100));
    }
}
