package com.portofis.backend.mapper;

import com.portofis.backend.dto.contact.ContactMessageRequest;
import com.portofis.backend.dto.contact.ContactMessageResponse;
import com.portofis.backend.entity.ContactMessageEntity;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {

    public ContactMessageResponse toDto(ContactMessageEntity e) {
        return new ContactMessageResponse(e.getId(), e.getName(), e.getPhone(), e.getEmail(),
                e.getSubject(), e.getMessage(), e.getStatus(), e.getCreatedAt());
    }

    public ContactMessageEntity toEntity(ContactMessageRequest r) {
        ContactMessageEntity e = new ContactMessageEntity();
        e.setName(r.name());
        e.setPhone(r.phone());
        e.setEmail(r.email());
        e.setSubject(r.subject());
        e.setMessage(r.message());
        return e;
    }
}
