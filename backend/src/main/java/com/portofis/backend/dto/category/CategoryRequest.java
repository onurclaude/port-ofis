package com.portofis.backend.dto.category;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record CategoryRequest(
        @NotBlank(message = "Slug zorunludur.")
        @Size(min = 2, max = 120, message = "Slug 2-120 karakter olmalıdır.")
        @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "Slug küçük harf ve tire içeren kebab-case formatında olmalıdır.")
        String slug,

        @NotBlank(message = "Ad zorunludur.")
        @Size(min = 2, max = 150, message = "Ad 2-150 karakter olmalıdır.")
        String name,

        @Size(max = 2000, message = "Açıklama en fazla 2000 karakter olmalıdır.")
        String description,

        @Size(max = 500, message = "Görsel URL en fazla 500 karakter olmalıdır.")
        @URL(message = "Geçerli bir URL giriniz.")
        String imageUrl,

        @NotNull(message = "Sıralama zorunludur.")
        @Min(value = 0, message = "Sıralama 0 veya daha büyük olmalıdır.")
        Integer displayOrder,

        @NotNull(message = "Aktiflik durumu zorunludur.")
        Boolean isActive
) {
}
