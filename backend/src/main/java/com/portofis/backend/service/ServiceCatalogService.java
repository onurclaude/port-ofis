package com.portofis.backend.service;

import com.portofis.backend.dto.service.ServiceAdminDto;
import com.portofis.backend.dto.service.ServiceDto;
import com.portofis.backend.dto.service.ServiceRequest;
import com.portofis.backend.entity.ServiceEntity;
import com.portofis.backend.exception.ConflictException;
import com.portofis.backend.exception.NotFoundException;
import com.portofis.backend.mapper.ServiceMapper;
import com.portofis.backend.repository.ServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;

    public ServiceCatalogService(ServiceRepository serviceRepository, ServiceMapper serviceMapper) {
        this.serviceRepository = serviceRepository;
        this.serviceMapper = serviceMapper;
    }

    public List<ServiceDto> findAllActive() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAscNameAsc().stream()
                .map(serviceMapper::toDto)
                .toList();
    }

    public ServiceDto findActiveBySlug(String slug) {
        ServiceEntity entity = serviceRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Hizmet bulunamadı."));
        return serviceMapper.toDto(entity);
    }

    public List<ServiceAdminDto> findAllForAdmin() {
        return serviceRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(serviceMapper::toAdminDto)
                .toList();
    }

    public ServiceAdminDto findByIdForAdmin(Long id) {
        return serviceMapper.toAdminDto(getOrThrow(id));
    }

    @Transactional
    public ServiceAdminDto create(ServiceRequest request) {
        assertSlugAvailable(request.slug(), null);
        ServiceEntity entity = serviceMapper.toEntity(request);
        return serviceMapper.toAdminDto(serviceRepository.save(entity));
    }

    @Transactional
    public ServiceAdminDto update(Long id, ServiceRequest request) {
        ServiceEntity entity = getOrThrow(id);
        assertSlugAvailable(request.slug(), id);
        serviceMapper.applyRequest(entity, request);
        // saveAndFlush forces the @PreUpdate callback (which sets updatedAt) to run
        // synchronously, so the DTO built below reflects this update, not the previous one.
        return serviceMapper.toAdminDto(serviceRepository.saveAndFlush(entity));
    }

    @Transactional
    public void delete(Long id) {
        ServiceEntity entity = getOrThrow(id);
        serviceRepository.delete(entity);
    }

    private ServiceEntity getOrThrow(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Hizmet bulunamadı."));
    }

    private void assertSlugAvailable(String slug, Long excludingId) {
        boolean exists = excludingId == null
                ? serviceRepository.existsBySlug(slug)
                : serviceRepository.existsBySlugAndIdNot(slug, excludingId);
        if (exists) {
            throw new ConflictException("Bu slug zaten kullanılıyor.");
        }
    }
}
