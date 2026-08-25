package com.portofis.backend;

import com.portofis.backend.entity.AdminUserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies docs/DATABASE_SCHEMA.md §6 / docs/ARCHITECTURE.md §6: the first admin_users row
 * is created at startup, only when the table is empty, from ADMIN_DEFAULT_USERNAME /
 * ADMIN_DEFAULT_PASSWORD, with the password BCrypt-hashed. Uses its own Spring context
 * (different admin.default.* properties than the shared AbstractIntegrationTest contexts)
 * so it observes a genuinely fresh, empty admin_users table.
 */
@SpringBootTest(properties = {
        "admin.default.username=bootstrap-admin",
        "admin.default.password=bootstrapPassw0rd"
})
@ActiveProfiles("test")
class AdminBootstrapIntegrationTest extends AbstractIntegrationTest {

    @Test
    void createsFirstAdminUserFromEnvVarsOnStartup() {
        Optional<AdminUserEntity> admin = adminUserRepository.findByUsername("bootstrap-admin");
        assertThat(admin).isPresent();
        assertThat(admin.get().getPasswordHash()).isNotEqualTo("bootstrapPassw0rd");
        assertThat(passwordEncoder.matches("bootstrapPassw0rd", admin.get().getPasswordHash())).isTrue();
    }
}
