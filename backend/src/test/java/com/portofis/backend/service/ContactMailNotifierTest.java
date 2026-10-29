package com.portofis.backend.service;

import com.portofis.backend.dto.contact.ContactMessageResponse;
import com.portofis.backend.entity.ContactMessageStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContactMailNotifierTest {

    private final ContactMessageResponse message = new ContactMessageResponse(
            42L, "Ahmet\r\nYilmaz", "0555 123 45 67", "ahmet@example.com",
            "Kurumsal Teklif Talebi", "Ofisimiz icin kirtasiye teklifi rica ederiz.",
            ContactMessageStatus.NEW, Instant.parse("2026-10-29T08:30:00Z"));

    @SuppressWarnings("unchecked")
    private static ObjectProvider<JavaMailSender> provider(JavaMailSender sender) {
        ObjectProvider<JavaMailSender> p = mock(ObjectProvider.class);
        when(p.getIfAvailable()).thenReturn(sender);
        return p;
    }

    @Test
    void buildsNotificationWithReplyToVisitorAndSingleLineHeaders() {
        ContactMailNotifier notifier = new ContactMailNotifier(provider(null),
                "portofiskirtasiye@gmail.com", "\"Port Ofis\" <noreply@ozsoyonur.com>");

        SimpleMailMessage mail = notifier.buildMessage(message);

        assertThat(mail.getTo()).containsExactly("portofiskirtasiye@gmail.com");
        assertThat(mail.getFrom()).isEqualTo("\"Port Ofis\" <noreply@ozsoyonur.com>");
        assertThat(mail.getReplyTo()).isEqualTo("ahmet@example.com");
        assertThat(mail.getSubject()).isEqualTo("Yeni mesaj: Kurumsal Teklif Talebi — Ahmet Yilmaz");
        assertThat(mail.getText())
                .contains("0555 123 45 67")
                .contains("Ofisimiz icin kirtasiye teklifi rica ederiz.")
                .contains("29.10.2026 11:30")
                .contains("#42");
    }

    @Test
    void sendsMailWhenConfigured() {
        JavaMailSender sender = mock(JavaMailSender.class);
        new ContactMailNotifier(provider(sender), "portofiskirtasiye@gmail.com", "")
                .onSubmitted(new ContactMessageSubmittedEvent(message));
        verify(sender).send(any(SimpleMailMessage.class));
    }

    @Test
    void skipsWhenRecipientOrSenderMissing() {
        JavaMailSender sender = mock(JavaMailSender.class);
        new ContactMailNotifier(provider(sender), "", "").onSubmitted(new ContactMessageSubmittedEvent(message));
        verifyNoInteractions(sender);

        new ContactMailNotifier(provider(null), "x@example.com", "")
                .onSubmitted(new ContactMessageSubmittedEvent(message)); // no exception
    }

    @Test
    void skipsWhenMailHostIsBlank() {
        JavaMailSender sender = spy(new org.springframework.mail.javamail.JavaMailSenderImpl());
        new ContactMailNotifier(provider(sender), "portofiskirtasiye@gmail.com", "")
                .onSubmitted(new ContactMessageSubmittedEvent(message));
        verify(sender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void mailFailureDoesNotPropagate() {
        JavaMailSender sender = mock(JavaMailSender.class);
        doThrow(new MailSendException("smtp down")).when(sender).send(any(SimpleMailMessage.class));
        new ContactMailNotifier(provider(sender), "portofiskirtasiye@gmail.com", "")
                .onSubmitted(new ContactMessageSubmittedEvent(message));
        verify(sender).send(any(SimpleMailMessage.class));
    }
}
