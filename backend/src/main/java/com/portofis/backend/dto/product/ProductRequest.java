package com.portofis.backend.dto.product;

import com.portofis.backend.entity.StockStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;

public record ProductRequest(
        @NotNull(message = "Geçerli bir kategori seçiniz.")
        Long categoryId,

        @NotBlank(message = "Slug zorunludur.")
        @Size(min = 2, max = 150, message = "Slug 2-150 karakter olmalıdır.")
        @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "Slug küçük harf ve tire içeren kebab-case formatında olmalıdır.")
        String slug,

        @NotBlank(message = "Ad zorunludur.")
        @Size(min = 2, max = 200, message = "Ad 2-200 karakter olmalıdır.")
        String name,

        @Size(max = 4000, message = "Açıklama en fazla 4000 karakter olmalıdır.")
        String description,

        @Size(max = 500, message = "Görsel URL en fazla 500 karakter olmalıdır.")
        @URL(message = "Geçerli bir URL giriniz.")
        String imageUrl,

        @DecimalMin(value = "0.00", message = "Fiyat 0 veya daha büyük olmalıdır.")
        @Digits(integer = 8, fraction = 2, message = "Fiyat en fazla 2 ondalık basamak içerebilir.")
        BigDecimal price,

        @NotNull(message = "Stok durumu zorunludur.")
        StockStatus stockStatus,

        @NotNull(message = "Sıralama zorunludur.")
        @Min(value = 0, message = "Sıralama 0 veya daha büyük olmalıdır.")
        Integer displayOrder,

        @NotNull(message = "Aktiflik durumu zorunludur.")
        Boolean isActive
) {
}
