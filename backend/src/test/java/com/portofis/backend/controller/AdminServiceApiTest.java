package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminServiceApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    String token;

    @BeforeEach
    void setUp() {
        token = createAdminAndToken("svc-admin", "password123");
    }

    private String validPayload(String slug) {
        return """
                {
                  "slug": "%s",
                  "name": "Test Hizmeti",
                  "shortDescription": "Kisa aciklama",
                  "description": "Uzun aciklama metni",
                  "iconKey": "printer",
                  "displayOrder": 99,
                  "isActive": true
                }
                """.formatted(slug);
    }

    @Test
    void createThenGetThenUpdateThenDelete() throws Exception {
        String createResponse = mockMvc.perform(post("/api/admin/services")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload("test-hizmeti-crud")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("test-hizmeti-crud"))
                .andExpect(jsonPath("$.isActive").value(true))
                .andExpect(jsonPath("$.createdAt").exists())
                .andReturn().getResponse().getContentAsString();

        long id = ((Number) com.jayway.jsonpath.JsonPath.read(createResponse, "$.id")).longValue();

        mockMvc.perform(get("/api/admin/services/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("test-hizmeti-crud"));

        String updatePayload = validPayload("test-hizmeti-crud").replace("Test Hizmeti", "Guncellenmis Hizmet");
        mockMvc.perform(put("/api/admin/services/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Guncellenmis Hizmet"));

        mockMvc.perform(delete("/api/admin/services/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/services/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void duplicateSlugReturnsConflict() throws Exception {
        mockMvc.perform(post("/api/admin/services").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(validPayload("duplicate-slug-svc")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/admin/services").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(validPayload("duplicate-slug-svc")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value("Bu slug zaten kullanılıyor."));
    }

    @Test
    void invalidSlugPatternIsValidationError() throws Exception {
        mockMvc.perform(post("/api/admin/services").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(validPayload("Not_Kebab_Case")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("slug"));
    }

    @Test
    void deletingUnknownIdReturns404() throws Exception {
        mockMvc.perform(delete("/api/admin/services/999999").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }

    /**
     * Regression test for BUG-004: the PUT response's updatedAt must reflect the update just
     * performed (not the previous revision) and must match what an immediate follow-up GET
     * returns. Root cause was @PreUpdate firing only at flush time, after the DTO had already
     * been built from the stale in-memory entity; fixed via saveAndFlush in the service layer.
     */
    @Test
    void putResponseUpdatedAtReflectsThisUpdateNotThePreviousOne() throws Exception {
        String createResponse = mockMvc.perform(post("/api/admin/services")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload("updated-at-svc")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = ((Number) com.jayway.jsonpath.JsonPath.read(createResponse, "$.id")).longValue();
        String createdUpdatedAt = com.jayway.jsonpath.JsonPath.read(createResponse, "$.updatedAt");

        Thread.sleep(10);
        String put1Response = mockMvc.perform(put("/api/admin/services/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload("updated-at-svc").replace("Test Hizmeti", "Guncelleme Bir")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put1UpdatedAt = com.jayway.jsonpath.JsonPath.read(put1Response, "$.updatedAt");

        // The first PUT's own response must already show a newer updatedAt than creation,
        // not the stale creation-time value.
        org.assertj.core.api.Assertions.assertThat(put1UpdatedAt).isNotEqualTo(createdUpdatedAt);

        Thread.sleep(10);
        String put2Response = mockMvc.perform(put("/api/admin/services/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validPayload("updated-at-svc").replace("Test Hizmeti", "Guncelleme Iki")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String put2UpdatedAt = com.jayway.jsonpath.JsonPath.read(put2Response, "$.updatedAt");

        // The second PUT's response must reflect this update, not the first one's timestamp.
        org.assertj.core.api.Assertions.assertThat(put2UpdatedAt).isNotEqualTo(put1UpdatedAt);

        String getResponse = mockMvc.perform(get("/api/admin/services/" + id)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String getUpdatedAt = com.jayway.jsonpath.JsonPath.read(getResponse, "$.updatedAt");

        // A follow-up GET must show exactly what the second PUT's response already reported.
        org.assertj.core.api.Assertions.assertThat(getUpdatedAt).isEqualTo(put2UpdatedAt);
    }
}
