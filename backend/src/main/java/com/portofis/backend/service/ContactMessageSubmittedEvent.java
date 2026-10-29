package com.portofis.backend.service;

import com.portofis.backend.dto.contact.ContactMessageResponse;

/** Yeni bir iletişim mesajı kaydedildiğinde yayınlanır (bildirim maili için). */
public record ContactMessageSubmittedEvent(ContactMessageResponse message) {
}
