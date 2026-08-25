package com.portofis.backend.config;

import com.portofis.backend.entity.AdminUserEntity;
import com.portofis.backend.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Provisions the very first admin_users row at startup, only if the table is empty,
 * from ADMIN_DEFAULT_USERNAME / ADMIN_DEFAULT_PASSWORD env vars — never baked into a
 * Flyway migration, which would commit a real or placeholder credential to source
 * control. See docs/ARCHITECTURE.md §6 and docs/DATABASE_SCHEMA.md §6.
 */
@Component
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String defaultUsername;
    private final String defaultPassword;

    public AdminBootstrapRunner(AdminUserRepository adminUserRepository,
                                 PasswordEncoder passwordEncoder,
                                 @Value("${admin.default.username:}") String defaultUsername,
                                 @Value("${admin.default.password:}") String defaultPassword) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.defaultUsername = defaultUsername;
        this.defaultPassword = defaultPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminUserRepository.count() > 0) {
            return;
        }
        if (defaultUsername == null || defaultUsername.isBlank() || defaultPassword == null || defaultPassword.isBlank()) {
            log.warn("admin_users table is empty and ADMIN_DEFAULT_USERNAME/ADMIN_DEFAULT_PASSWORD are not set; "
                    + "no admin user was created. Set both env vars and restart to bootstrap the first admin.");
            return;
        }
        AdminUserEntity admin = new AdminUserEntity();
        admin.setUsername(defaultUsername);
        admin.setPasswordHash(passwordEncoder.encode(defaultPassword));
        adminUserRepository.save(admin);
        log.info("Bootstrapped initial admin user '{}'.", defaultUsername);
    }
}
