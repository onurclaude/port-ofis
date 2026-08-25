package com.portofis.backend.exception;

import com.portofis.backend.dto.common.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.List;

/**
 * Used for validation failures that Bean Validation on the request DTO cannot express,
 * e.g. a {@code categoryId} that is well-formed but does not reference an existing row
 * (docs/API_CONTRACT.md §12.2: "not 404, because the category id is a field on the request body").
 */
public class FieldValidationException extends ApiException {

    public FieldValidationException(String field, String message) {
        super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Doğrulama hatası oluştu.",
                List.of(new ErrorResponse.FieldErrorItem(field, message)));
    }
}
