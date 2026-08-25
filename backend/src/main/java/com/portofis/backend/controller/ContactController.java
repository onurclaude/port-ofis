package com.portofis.backend.controller;

import com.portofis.backend.dto.contact.ContactMessageRequest;
import com.portofis.backend.dto.contact.ContactMessageResponse;
import com.portofis.backend.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageService contactMessageService;

    public ContactController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    public ResponseEntity<ContactMessageResponse> submit(@Valid @RequestBody ContactMessageRequest request) {
        ContactMessageResponse response = contactMessageService.submit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
