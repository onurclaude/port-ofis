package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import com.portofis.backend.entity.ContactMessageEntity;
import com.portofis.backend.entity.ContactMessageStatus;
import com.portofis.backend.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminContactMessageApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ContactMessageRepository contactMessageRepository;

    String token;

    @BeforeEach
    void setUp() {
        token = createAdminAndToken("msg-admin", "password123");
    }

    private ContactMessageEntity newMessage(ContactMessageStatus status) {
        ContactMessageEntity e = new ContactMessageEntity();
        e.setName("Test Kişi");
        e.setPhone("0555 000 00 00");
        e.setEmail("test@example.com");
        e.setSubject("Konu");
        e.setMessage("Mesaj metni yeterince uzun olacak şekilde yazılmıştır.");
        e.setStatus(status);
        return contactMessageRepository.save(e);
    }

    @Test
    void unreadFirstOrderingWhenNoStatusFilter() throws Exception {
        newMessage(ContactMessageStatus.READ);
        ContactMessageEntity unread = newMessage(ContactMessageStatus.NEW);

        mockMvc.perform(get("/api/admin/contact-messages").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].status").value("NEW"))
                .andExpect(jsonPath("$.content[0].id").value(unread.getId()));
    }

    @Test
    void statusFilterAppliesAndDefaultSizeIsTwenty() throws Exception {
        newMessage(ContactMessageStatus.NEW);
        newMessage(ContactMessageStatus.READ);

        mockMvc.perform(get("/api/admin/contact-messages").header("Authorization", "Bearer " + token)
                        .param("status", "READ"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.content[0].status").value("READ"));
    }

    @Test
    void patchStatusUpdatesAndPersists() throws Exception {
        ContactMessageEntity message = newMessage(ContactMessageStatus.NEW);

        mockMvc.perform(patch("/api/admin/contact-messages/" + message.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"READ\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READ"));

        mockMvc.perform(get("/api/admin/contact-messages/" + message.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("READ"));
    }

    @Test
    void invalidStatusValueIsBadRequest() throws Exception {
        ContactMessageEntity message = newMessage(ContactMessageStatus.NEW);

        mockMvc.perform(patch("/api/admin/contact-messages/" + message.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"BOGUS\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteRemovesMessage() throws Exception {
        ContactMessageEntity message = newMessage(ContactMessageStatus.NEW);

        mockMvc.perform(delete("/api/admin/contact-messages/" + message.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin/contact-messages/" + message.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
