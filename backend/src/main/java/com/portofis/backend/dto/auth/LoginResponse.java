package com.portofis.backend.dto.auth;

import java.time.Instant;

public record LoginResponse(
        String token,
        Instant expiresAt,
        String username
) {
}
