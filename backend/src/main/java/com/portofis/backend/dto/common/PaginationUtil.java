package com.portofis.backend.dto.common;

import com.portofis.backend.exception.BadRequestException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Builds a validated, clamped Pageable per docs/API_CONTRACT.md §2:
 * page is 0-based (default varies per endpoint), size is clamped to max 100
 * (not rejected), and a negative page/size is a 400 BAD_REQUEST.
 */
public final class PaginationUtil {

    public static final int MAX_SIZE = 100;

    private PaginationUtil() {
    }

    public static Pageable of(int page, int size, Sort sort) {
        if (page < 0) {
            throw new BadRequestException("page 0 veya daha büyük olmalıdır.");
        }
        if (size <= 0) {
            throw new BadRequestException("size 0'dan büyük olmalıdır.");
        }
        int clampedSize = Math.min(size, MAX_SIZE);
        return PageRequest.of(page, clampedSize, sort);
    }

    public static Pageable of(int page, int size) {
        return of(page, size, Sort.unsorted());
    }
}
