package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PublicServiceApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void listsActiveServicesOrderedByDisplayOrder() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].slug").value("dijital-baski"))
                .andExpect(jsonPath("$[0].displayOrder").value(1))
                .andExpect(jsonPath("$[0].isActive").doesNotExist())
                .andExpect(jsonPath("$[0].createdAt").doesNotExist());
    }

    @Test
    void findsBySlug() throws Exception {
        mockMvc.perform(get("/api/services/kirtasiye"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Kırtasiye"));
    }

    @Test
    void returns404ForUnknownSlug() throws Exception {
        mockMvc.perform(get("/api/services/does-not-exist"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.fieldErrors", hasSize(0)));
    }
}
