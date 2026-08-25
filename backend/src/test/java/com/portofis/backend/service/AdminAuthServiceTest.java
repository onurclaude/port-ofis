package com.portofis.backend.service;

import com.portofis.backend.dto.auth.LoginRequest;
import com.portofis.backend.entity.AdminUserEntity;
import com.portofis.backend.exception.UnauthorizedException;
import com.portofis.backend.repository.AdminUserRepository;
import com.portofis.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    @Mock
    AdminUserRepository adminUserRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtService jwtService;

    AdminAuthService sut;

    @BeforeEach
    void setUp() {
        sut = new AdminAuthService(adminUserRepository, passwordEncoder, jwtService);
    }

    @Test
    void loginThrowsUnauthorizedWithGenericMessageWhenUserDoesNotExist() {
        when(adminUserRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sut.login(new LoginRequest("ghost", "whatever")))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Kullanıcı adı veya şifre hatalı.");
    }

    @Test
    void loginThrowsUnauthorizedWithGenericMessageWhenPasswordWrong() {
        AdminUserEntity user = new AdminUserEntity();
        user.setUsername("admin");
        user.setPasswordHash("hashed");
        when(adminUserRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> sut.login(new LoginRequest("admin", "wrong")))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Kullanıcı adı veya şifre hatalı.");
    }

    @Test
    void loginReturnsTokenOnSuccess() {
        AdminUserEntity user = new AdminUserEntity();
        user.setUsername("admin");
        user.setPasswordHash("hashed");
        when(adminUserRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correct", "hashed")).thenReturn(true);
        Instant expiry = Instant.now().plusSeconds(3600);
        when(jwtService.generateToken("admin")).thenReturn(new JwtService.TokenResult("jwt-token", expiry));

        var response = sut.login(new LoginRequest("admin", "correct"));

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.username()).isEqualTo("admin");
        assertThat(response.expiresAt()).isEqualTo(expiry);
    }
}
