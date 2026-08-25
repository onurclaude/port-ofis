package com.portofis.backend.exception;

import com.portofis.backend.dto.common.ErrorResponse;
import org.springframework.http.HttpStatus;

import java.util.List;

/**
 * Base type for all handled application exceptions. Carries everything
 * {@link com.portofis.backend.exception.GlobalExceptionHandler} needs to build
 * the standard error model from docs/API_CONTRACT.md §3.
 */
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;
    private final List<ErrorResponse.FieldErrorItem> fieldErrors;

    protected ApiException(HttpStatus status, String code, String message) {
        this(status, code, message, List.of());
    }

    protected ApiException(HttpStatus status, String code, String message, List<ErrorResponse.FieldErrorItem> fieldErrors) {
        super(message);
        this.status = status;
        this.code = code;
        this.fieldErrors = fieldErrors;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public List<ErrorResponse.FieldErrorItem> getFieldErrors() {
        return fieldErrors;
    }
}
