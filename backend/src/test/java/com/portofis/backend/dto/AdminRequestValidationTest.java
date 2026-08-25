package com.portofis.backend.dto;

import com.portofis.backend.dto.product.ProductRequest;
import com.portofis.backend.dto.service.ServiceRequest;
import com.portofis.backend.entity.StockStatus;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class AdminRequestValidationTest {

    static ValidatorFactory factory;
    static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    @Test
    void serviceRequestRejectsNonKebabCaseSlug() {
        ServiceRequest req = new ServiceRequest("Not_Kebab_Case", "Ad", "Kısa", "Uzun açıklama", "printer", 1, true);
        assertThat(validator.validate(req))
                .anyMatch(v -> v.getPropertyPath().toString().equals("slug"));
    }

    @Test
    void serviceRequestAcceptsValidKebabCaseSlug() {
        ServiceRequest req = new ServiceRequest("gecerli-slug-123", "Ad", "Kısa açıklama", "Uzun açıklama",
                "printer", 0, true);
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test
    void serviceRequestRejectsNegativeDisplayOrder() {
        ServiceRequest req = new ServiceRequest("gecerli-slug", "Ad", "Kısa açıklama", "Uzun açıklama",
                "printer", -1, true);
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("displayOrder"));
    }

    @Test
    void productRequestRejectsNegativePrice() {
        ProductRequest req = new ProductRequest(1L, "urun-slug", "Ürün", null, null,
                new BigDecimal("-1.00"), StockStatus.IN_STOCK, 0, true);
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("price"));
    }

    @Test
    void productRequestRejectsMoreThanTwoDecimalPlaces() {
        ProductRequest req = new ProductRequest(1L, "urun-slug", "Ürün", null, null,
                new BigDecimal("10.999"), StockStatus.IN_STOCK, 0, true);
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("price"));
    }

    @Test
    void productRequestRejectsMissingCategoryId() {
        ProductRequest req = new ProductRequest(null, "urun-slug", "Ürün", null, null,
                null, StockStatus.IN_STOCK, 0, true);
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("categoryId"));
    }

    @Test
    void productRequestAcceptsNullPriceAndValidData() {
        ProductRequest req = new ProductRequest(1L, "urun-slug", "Ürün", null, null,
                null, StockStatus.IN_STOCK, 0, true);
        assertThat(validator.validate(req)).isEmpty();
    }
}
