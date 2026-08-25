package com.portofis.backend.service;

import com.portofis.backend.dto.common.PageResponse;
import com.portofis.backend.dto.common.PaginationUtil;
import com.portofis.backend.dto.contact.ContactMessageRequest;
import com.portofis.backend.dto.contact.ContactMessageResponse;
import com.portofis.backend.dto.contact.ContactMessageStatusRequest;
import com.portofis.backend.entity.ContactMessageEntity;
import com.portofis.backend.entity.ContactMessageStatus;
import com.portofis.backend.exception.NotFoundException;
import com.portofis.backend.mapper.ContactMessageMapper;
import com.portofis.backend.repository.ContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageMapper contactMessageMapper;

    public ContactMessageService(ContactMessageRepository contactMessageRepository,
                                  ContactMessageMapper contactMessageMapper) {
        this.contactMessageRepository = contactMessageRepository;
        this.contactMessageMapper = contactMessageMapper;
    }

    @Transactional
    public ContactMessageResponse submit(ContactMessageRequest request) {
        ContactMessageEntity entity = contactMessageMapper.toEntity(request);
        return contactMessageMapper.toDto(contactMessageRepository.save(entity));
    }

    public PageResponse<ContactMessageResponse> findAll(ContactMessageStatus status, int page, int size) {
        Pageable pageable = PaginationUtil.of(page, size);
        Page<ContactMessageEntity> result = status == null
                ? contactMessageRepository.findAllOrderedByUnreadFirstThenNewest(pageable)
                : contactMessageRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return PageResponse.of(result, contactMessageMapper::toDto);
    }

    public ContactMessageResponse findById(Long id) {
        return contactMessageMapper.toDto(getOrThrow(id));
    }

    @Transactional
    public ContactMessageResponse updateStatus(Long id, ContactMessageStatusRequest request) {
        ContactMessageEntity entity = getOrThrow(id);
        entity.setStatus(request.status());
        return contactMessageMapper.toDto(contactMessageRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        ContactMessageEntity entity = getOrThrow(id);
        contactMessageRepository.delete(entity);
    }

    private ContactMessageEntity getOrThrow(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("İletişim mesajı bulunamadı."));
    }
}
