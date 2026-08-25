package com.portofis.backend.mapper;

import com.portofis.backend.dto.service.ServiceAdminDto;
import com.portofis.backend.dto.service.ServiceDto;
import com.portofis.backend.dto.service.ServiceRequest;
import com.portofis.backend.entity.ServiceEntity;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public ServiceDto toDto(ServiceEntity e) {
        return new ServiceDto(e.getId(), e.getSlug(), e.getName(), e.getShortDescription(),
                e.getDescription(), e.getIconKey(), e.getDisplayOrder());
    }

    public ServiceAdminDto toAdminDto(ServiceEntity e) {
        return new ServiceAdminDto(e.getId(), e.getSlug(), e.getName(), e.getShortDescription(),
                e.getDescription(), e.getIconKey(), e.getDisplayOrder(), e.getIsActive(),
                e.getCreatedAt(), e.getUpdatedAt());
    }

    public ServiceEntity toEntity(ServiceRequest r) {
        ServiceEntity e = new ServiceEntity();
        applyRequest(e, r);
        return e;
    }

    public void applyRequest(ServiceEntity e, ServiceRequest r) {
        e.setSlug(r.slug());
        e.setName(r.name());
        e.setShortDescription(r.shortDescription());
        e.setDescription(r.description());
        e.setIconKey(r.iconKey());
        e.setDisplayOrder(r.displayOrder());
        e.setIsActive(r.isActive());
    }
}
