package com.portofis.backend.dto.settings;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record SiteSettingsDto(
        @NotBlank(message = "Site adı zorunludur.")
        String siteName,

        @NotBlank(message = "Telefon zorunludur.")
        String phone,

        @NotBlank(message = "Adres zorunludur.")
        String address,

        @URL(message = "Geçerli bir URL giriniz.")
        String websiteUrl,

        String whatsappNumber,

        @URL(message = "Geçerli bir URL giriniz.")
        String instagramUrl,

        @URL(message = "Geçerli bir URL giriniz.")
        String facebookUrl,

        String workingHours,

        @URL(message = "Geçerli bir URL giriniz.")
        String mapEmbedUrl,

        String footerNote
) {
}
