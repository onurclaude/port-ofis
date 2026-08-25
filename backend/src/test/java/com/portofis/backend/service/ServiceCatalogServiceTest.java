package com.portofis.backend.service;

import com.portofis.backend.dto.service.ServiceAdminDto;
import com.portofis.backend.dto.service.ServiceRequest;
import com.portofis.backend.entity.ServiceEntity;
import com.portofis.backend.exception.ConflictException;
import com.portofis.backend.exception.NotFoundException;
import com.portofis.backend.mapper.ServiceMapper;
import com.portofis.backend.repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Pure unit test (Mockito, no Spring context) for the business rules that live in the
 * service layer: slug-uniqueness -> 409 CONFLICT, missing id -> 404 NOT_FOUND.
 */
@ExtendWith(MockitoExtension.class)
class ServiceCatalogServiceTest {

    @Mock
    ServiceRepository serviceRepository;

    ServiceMapper serviceMapper = new ServiceMapper();

    ServiceCatalogService sut;

    @BeforeEach
    void setUp() {
        sut = new ServiceCatalogService(serviceRepository, serviceMapper);
    }

    private ServiceRequest validRequest(String slug) {
        return new ServiceRequest(slug, "Ad", "Kısa açıklama", "Uzun açıklama", "printer", 1, true);
    }

    @Test
    void createThrowsConflictWhenSlugAlreadyExists() {
        when(serviceRepository.existsBySlug("dijital-baski")).thenReturn(true);

        assertThatThrownBy(() -> sut.create(validRequest("dijital-baski")))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Bu slug zaten kullanılıyor.");

        verify(serviceRepository, never()).save(any());
    }

    @Test
    void createSavesEntityWhenSlugIsAvailable() {
        when(serviceRepository.existsBySlug("yeni-hizmet")).thenReturn(false);
        ServiceEntity saved = new ServiceEntity();
        saved.setId(1L);
        saved.setSlug("yeni-hizmet");
        saved.setName("Ad");
        saved.setShortDescription("Kısa açıklama");
        saved.setDescription("Uzun açıklama");
        saved.setIconKey("printer");
        saved.setDisplayOrder(1);
        saved.setIsActive(true);
        when(serviceRepository.save(any(ServiceEntity.class))).thenReturn(saved);

        ServiceAdminDto result = sut.create(validRequest("yeni-hizmet"));

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.slug()).isEqualTo("yeni-hizmet");
    }

    @Test
    void findByIdForAdminThrowsNotFoundWhenMissing() {
        when(serviceRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sut.findByIdForAdmin(42L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateThrowsConflictWhenNewSlugTakenByAnotherRow() {
        ServiceEntity existing = new ServiceEntity();
        existing.setId(5L);
        existing.setSlug("eski-slug");
        when(serviceRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(serviceRepository.existsBySlugAndIdNot("baska-slug", 5L)).thenReturn(true);

        assertThatThrownBy(() -> sut.update(5L, validRequest("baska-slug")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void deleteThrowsNotFoundWhenMissing() {
        when(serviceRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sut.delete(1L)).isInstanceOf(NotFoundException.class);
    }
}
