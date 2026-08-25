package com.portofis.backend.dto.contact;

import com.portofis.backend.entity.ContactMessageStatus;

import java.time.Instant;

public record ContactMessageResponse(
        Long id,
        String name,
        String phone,
        String email,
        String subject,
        String message,
        ContactMessageStatus status,
        Instant createdAt
) {
}
