package com.portofis.backend.service;

import com.portofis.backend.dto.auth.LoginRequest;
import com.portofis.backend.dto.auth.LoginResponse;
import com.portofis.backend.entity.AdminUserEntity;
import com.portofis.backend.exception.UnauthorizedException;
import com.portofis.backend.repository.AdminUserRepository;
import com.portofis.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminAuthService {

    private static final String BAD_CREDENTIALS_MESSAGE = "Kullanıcı adı veya şifre hatalı.";

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminAuthService(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder,
                             JwtService jwtService) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        AdminUserEntity user = adminUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException(BAD_CREDENTIALS_MESSAGE));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException(BAD_CREDENTIALS_MESSAGE);
        }
        JwtService.TokenResult tokenResult = jwtService.generateToken(user.getUsername());
        return new LoginResponse(tokenResult.token(), tokenResult.expiresAt(), user.getUsername());
    }
}
