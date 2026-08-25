package com.portofis.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portofis.backend.dto.common.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Reserved for future role checks (docs/API_CONTRACT.md §3: FORBIDDEN / 403) —
 * not triggered by anything in this phase since there is a single admin role,
 * but wired up so the error envelope stays consistent if/when it is.
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public JwtAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ErrorResponse body = ErrorResponse.of(403, "FORBIDDEN", "Bu işlem için yetkiniz yok.");
        objectMapper.writeValue(response.getWriter(), body);
    }
}
