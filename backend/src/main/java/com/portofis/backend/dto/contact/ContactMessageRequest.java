package com.portofis.backend.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Ad soyad zorunludur.")
        @Size(min = 2, max = 100, message = "Ad soyad 2-100 karakter olmalıdır.")
        String name,

        @NotBlank(message = "Telefon zorunludur.")
        @Size(min = 7, max = 20, message = "Telefon 7-20 karakter olmalıdır.")
        @Pattern(regexp = "^[0-9+() -]+$", message = "Geçerli bir telefon numarası giriniz.")
        String phone,

        @NotBlank(message = "E-posta zorunludur.")
        @Email(message = "Geçerli bir e-posta adresi giriniz.")
        @Size(max = 150, message = "E-posta en fazla 150 karakter olmalıdır.")
        String email,

        @NotBlank(message = "Konu zorunludur.")
        @Size(min = 3, max = 150, message = "Konu 3-150 karakter olmalıdır.")
        String subject,

        @NotBlank(message = "Mesaj zorunludur.")
        @Size(min = 10, max = 2000, message = "Mesaj 10-2000 karakter olmalıdır.")
        String message
) {
}
