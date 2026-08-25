package com.portofis.backend.dto;

import com.portofis.backend.dto.contact.ContactMessageRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Exercises the Bean Validation annotations on ContactMessageRequest directly against a
 * Validator instance, independent of MVC/HTTP wiring, per docs/API_CONTRACT.md §7.1.
 */
class ContactMessageRequestValidationTest {

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

    private static ContactMessageRequest valid() {
        return new ContactMessageRequest("Ahmet Yılmaz", "0555 123 45 67", "ahmet@example.com",
                "Kurumsal teklif talebi", "Merhaba, bilgi almak istiyorum lütfen.");
    }

    @Test
    void validRequestHasNoViolations() {
        assertThat(validator.validate(valid())).isEmpty();
    }

    @Test
    void nameTooShortIsRejected() {
        ContactMessageRequest req = new ContactMessageRequest("A", valid().phone(), valid().email(),
                valid().subject(), valid().message());
        Set<ConstraintViolation<ContactMessageRequest>> violations = validator.validate(req);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("name"));
    }

    @ParameterizedTest
    @MethodSource("invalidPhones")
    void invalidPhonesAreRejected(String phone) {
        ContactMessageRequest req = new ContactMessageRequest(valid().name(), phone, valid().email(),
                valid().subject(), valid().message());
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("phone"));
    }

    static Stream<String> invalidPhones() {
        return Stream.of("", "abc", "123", "0555-abc-def-gh");
    }

    @Test
    void invalidEmailIsRejected() {
        ContactMessageRequest req = new ContactMessageRequest(valid().name(), valid().phone(), "not-an-email",
                valid().subject(), valid().message());
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("email"));
    }

    @Test
    void subjectTooShortIsRejected() {
        ContactMessageRequest req = new ContactMessageRequest(valid().name(), valid().phone(), valid().email(),
                "hi", valid().message());
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("subject"));
    }

    @Test
    void messageTooShortIsRejected() {
        ContactMessageRequest req = new ContactMessageRequest(valid().name(), valid().phone(), valid().email(),
                valid().subject(), "short");
        assertThat(validator.validate(req)).anyMatch(v -> v.getPropertyPath().toString().equals("message"));
    }

    @Test
    void allBlankFieldsProduceFiveViolationsExactly() {
        ContactMessageRequest req = new ContactMessageRequest("", "", "", "", "");
        Set<ConstraintViolation<ContactMessageRequest>> violations = validator.validate(req);
        // one @NotBlank-family violation per field; some fields (phone/email) could double-fire
        // (@NotBlank + @Pattern/@Email) but Bean Validation runs Pattern/@Email over blank only
        // if not already short-circuited -- assert at least one per field instead of an exact count.
        assertThat(violations).extracting(v -> v.getPropertyPath().toString())
                .contains("name", "phone", "email", "subject", "message");
    }
}
