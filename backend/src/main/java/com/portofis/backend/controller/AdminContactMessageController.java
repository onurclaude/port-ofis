package com.portofis.backend.controller;

import com.portofis.backend.dto.common.PageResponse;
import com.portofis.backend.dto.contact.ContactMessageResponse;
import com.portofis.backend.dto.contact.ContactMessageStatusRequest;
import com.portofis.backend.entity.ContactMessageStatus;
import com.portofis.backend.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/contact-messages")
public class AdminContactMessageController {

    private final ContactMessageService contactMessageService;

    public AdminContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ContactMessageResponse>> findAll(
            @RequestParam(required = false) ContactMessageStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(contactMessageService.findAll(status, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageService.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactMessageResponse> updateStatus(@PathVariable Long id,
                                                                 @Valid @RequestBody ContactMessageStatusRequest request) {
        return ResponseEntity.ok(contactMessageService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactMessageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
