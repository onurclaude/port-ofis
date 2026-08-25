package com.portofis.backend.controller;

import com.portofis.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminAuthApiTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void loginSucceedsWithCorrectCredentials() throws Exception {
        adminUserRepository.save(newAdmin("admin1", "correctPassword1"));

        mockMvc.perform(post("/api/admin/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin1\",\"password\":\"correctPassword1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("admin1"))
                .andExpect(jsonPath("$.expiresAt").exists());
    }

    @Test
    void loginFailsWithWrongPasswordSameMessageAsUnknownUser() throws Exception {
        adminUserRepository.save(newAdmin("admin2", "correctPassword2"));

        String wrongPasswordBody = "{\"username\":\"admin2\",\"password\":\"wrongPassword\"}";
        String unknownUserBody = "{\"username\":\"nosuchuser\",\"password\":\"whatever123\"}";

        String wrongPasswordMessage = mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(wrongPasswordBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Kullanıcı adı veya şifre hatalı."))
                .andReturn().getResponse().getContentAsString();

        String unknownUserMessage = mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(unknownUserBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Kullanıcı adı veya şifre hatalı."))
                .andReturn().getResponse().getContentAsString();

        // Bodies differ only by timestamp; both must carry the identical error message/code.
        org.assertj.core.api.Assertions.assertThat(wrongPasswordMessage).contains("Kullanıcı adı veya şifre hatalı.");
        org.assertj.core.api.Assertions.assertThat(unknownUserMessage).contains("Kullanıcı adı veya şifre hatalı.");
    }

    @Test
    void loginRejectsBlankCredentials() throws Exception {
        mockMvc.perform(post("/api/admin/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void adminRouteWithoutTokenIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/services"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void adminRouteWithInvalidTokenIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/services").header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void adminRouteWithValidTokenSucceeds() throws Exception {
        String token = createAdminAndToken("admin3", "somePassword3");

        mockMvc.perform(get("/api/admin/services").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    private com.portofis.backend.entity.AdminUserEntity newAdmin(String username, String rawPassword) {
        com.portofis.backend.entity.AdminUserEntity admin = new com.portofis.backend.entity.AdminUserEntity();
        admin.setUsername(username);
        admin.setPasswordHash(passwordEncoder.encode(rawPassword));
        return admin;
    }
}
