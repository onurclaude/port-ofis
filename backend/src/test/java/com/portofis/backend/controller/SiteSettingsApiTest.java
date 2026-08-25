package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SiteSettingsApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void returnsAllTenKeysWithSeededValues() throws Exception {
        mockMvc.perform(get("/api/site-settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.siteName").value("Port Ofis Kırtasiye"))
                .andExpect(jsonPath("$.phone").value("0312 911 81 02"))
                .andExpect(jsonPath("$.whatsappNumber").value(""))
                .andExpect(jsonPath("$.instagramUrl").value(""))
                .andExpect(jsonPath("$.footerNote").exists());
    }
}
