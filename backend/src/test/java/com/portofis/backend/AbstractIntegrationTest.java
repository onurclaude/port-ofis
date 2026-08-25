package com.portofis.backend;

import com.portofis.backend.entity.AdminUserEntity;
import com.portofis.backend.repository.AdminUserRepository;
import com.portofis.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Shared base for API/integration tests: boots the full Spring context against a real
 * PostgreSQL instance (Testcontainers) so Flyway migrations, DB constraints (unique slug,
 * ON DELETE RESTRICT, CHECK constraints) and JPA mappings are exercised for real, not against
 * an approximation. The container is started once for the whole JVM (singleton pattern) and
 * reused by every subclass to keep the suite fast.
 *
 * Each test method runs in its own transaction that is rolled back afterwards, so test classes
 * do not interfere with each other's data despite sharing one schema/container.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class AbstractIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    static {
        POSTGRES.start();
    }

    @DynamicPropertySource
    static void registerDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    protected AdminUserRepository adminUserRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected JwtService jwtService;

    /** Persists an admin user directly (bypassing the login flow) and returns a valid bearer token for it. */
    protected String createAdminAndToken(String username, String rawPassword) {
        AdminUserEntity admin = new AdminUserEntity();
        admin.setUsername(username);
        admin.setPasswordHash(passwordEncoder.encode(rawPassword));
        adminUserRepository.save(admin);
        return jwtService.generateToken(username).token();
    }
}
