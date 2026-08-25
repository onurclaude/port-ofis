package com.portofis.backend.dto.contact;

import com.portofis.backend.entity.ContactMessageStatus;
import jakarta.validation.constraints.NotNull;

public record ContactMessageStatusRequest(
        @NotNull(message = "Durum zorunludur.")
        ContactMessageStatus status
) {
}
