package com.portofis.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Kullanıcı adı zorunludur.")
        String username,

        @NotBlank(message = "Şifre zorunludur.")
        String password
) {
}
