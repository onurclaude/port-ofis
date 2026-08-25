package com.portofis.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portofis.backend.AbstractIntegrationTest;
import com.portofis.backend.repository.ContactMessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ContactApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ContactMessageRepository contactMessageRepository;

    @Test
    void validSubmissionIsPersistedAndReturned() throws Exception {
        String body = """
                {
                  "name": "Ahmet Yilmaz",
                  "phone": "0555 123 45 67",
                  "email": "ahmet@example.com",
                  "subject": "Kurumsal teklif talebi",
                  "message": "Merhaba, ofisimiz icin kurumsal kirtasiye tedariki hakkinda bilgi almak istiyorum."
                }
                """;

        long before = contactMessageRepository.count();

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.name").value("Ahmet Yilmaz"));

        assertThat(contactMessageRepository.count()).isEqualTo(before + 1);
    }

    @Test
    void invalidSubmissionReturnsValidationErrorPerField() throws Exception {
        String body = """
                {
                  "name": "A",
                  "phone": "abc",
                  "email": "not-an-email",
                  "subject": "hi",
                  "message": "short"
                }
                """;

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors[*].field",
                        org.hamcrest.Matchers.hasItems("name", "phone", "email", "subject", "message")));
    }

    @Test
    void blankPayloadReturnsFieldErrorPerRequiredField() throws Exception {
        String body = """
                { "name": "", "phone": "", "email": "", "subject": "", "message": "" }
                """;

        mockMvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors[*].field",
                        org.hamcrest.Matchers.hasItems("name", "phone", "email", "subject", "message")));
    }
}
