package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminSiteSettingsApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    String token;

    @BeforeEach
    void setUp() {
        token = createAdminAndToken("settings-admin", "password123");
    }

    @Test
    void getMirrorsPublicShape() throws Exception {
        mockMvc.perform(get("/api/admin/site-settings").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.siteName").value("Port Ofis Kırtasiye"));
    }

    @Test
    void putReplacesAllTenFields() throws Exception {
        String payload = """
                {
                  "siteName": "Yeni Site Adı",
                  "phone": "0312 000 00 00",
                  "address": "Yeni Adres",
                  "websiteUrl": "https://example.com",
                  "whatsappNumber": "05551234567",
                  "instagramUrl": "https://instagram.com/example",
                  "facebookUrl": "",
                  "workingHours": "09:00-18:00",
                  "mapEmbedUrl": "",
                  "footerNote": "Yeni footer notu"
                }
                """;

        mockMvc.perform(put("/api/admin/site-settings").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.siteName").value("Yeni Site Adı"))
                .andExpect(jsonPath("$.instagramUrl").value("https://instagram.com/example"))
                .andExpect(jsonPath("$.facebookUrl").value(""));

        mockMvc.perform(get("/api/site-settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.siteName").value("Yeni Site Adı"));
    }

    @Test
    void blankRequiredFieldIsValidationError() throws Exception {
        String payload = """
                {
                  "siteName": "",
                  "phone": "0312 000 00 00",
                  "address": "Adres",
                  "websiteUrl": "",
                  "whatsappNumber": "",
                  "instagramUrl": "",
                  "facebookUrl": "",
                  "workingHours": "",
                  "mapEmbedUrl": "",
                  "footerNote": ""
                }
                """;

        mockMvc.perform(put("/api/admin/site-settings").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("siteName"));
    }

    @Test
    void invalidUrlFieldIsValidationError() throws Exception {
        String payload = """
                {
                  "siteName": "Site",
                  "phone": "0312 000 00 00",
                  "address": "Adres",
                  "websiteUrl": "not-a-valid-url",
                  "whatsappNumber": "",
                  "instagramUrl": "",
                  "facebookUrl": "",
                  "workingHours": "",
                  "mapEmbedUrl": "",
                  "footerNote": ""
                }
                """;

        mockMvc.perform(put("/api/admin/site-settings").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("websiteUrl"));
    }
}
