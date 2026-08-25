package com.portofis.backend.dto.service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ServiceRequest(
        @NotBlank(message = "Slug zorunludur.")
        @Size(min = 2, max = 120, message = "Slug 2-120 karakter olmalıdır.")
        @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "Slug küçük harf ve tire içeren kebab-case formatında olmalıdır.")
        String slug,

        @NotBlank(message = "Ad zorunludur.")
        @Size(min = 2, max = 150, message = "Ad 2-150 karakter olmalıdır.")
        String name,

        @NotBlank(message = "Kısa açıklama zorunludur.")
        @Size(min = 2, max = 200, message = "Kısa açıklama 2-200 karakter olmalıdır.")
        String shortDescription,

        @NotBlank(message = "Açıklama zorunludur.")
        @Size(min = 2, message = "Açıklama en az 2 karakter olmalıdır.")
        String description,

        @NotBlank(message = "İkon anahtarı zorunludur.")
        @Size(min = 2, max = 50, message = "İkon anahtarı 2-50 karakter olmalıdır.")
        String iconKey,

        @NotNull(message = "Sıralama zorunludur.")
        @Min(value = 0, message = "Sıralama 0 veya daha büyük olmalıdır.")
        Integer displayOrder,

        @NotNull(message = "Aktiflik durumu zorunludur.")
        Boolean isActive
) {
}
