package com.portofis.backend.service;

import com.portofis.backend.dto.contact.ContactMessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Yeni iletişim/teklif mesajını mail ile bildirir. Mesaj veritabanına kaydedildikten sonra
 * (AFTER_COMMIT) ayrı bir thread'de çalışır; mail gönderilemezse sadece loglanır, mesaj admin
 * panelinde kalır.
 */
@Component
public class ContactMailNotifier {

    private static final Logger log = LoggerFactory.getLogger(ContactMailNotifier.class);
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm").withZone(ZoneId.of("Europe/Istanbul"));

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String to;
    private final String from;

    public ContactMailNotifier(ObjectProvider<JavaMailSender> mailSender,
                               @Value("${contact.notification.to:}") String to,
                               @Value("${contact.notification.from:}") String from) {
        this.mailSender = mailSender;
        this.to = to;
        this.from = from;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSubmitted(ContactMessageSubmittedEvent event) {
        JavaMailSender sender = mailSender.getIfAvailable();
        // MAIL_HOST boş geçilirse Spring host'suz bir JavaMailSenderImpl oluşturur; onu da "ayarsız" say.
        boolean noHost = sender instanceof JavaMailSenderImpl impl
                && (impl.getHost() == null || impl.getHost().isBlank());
        if (sender == null || noHost || to.isBlank()) {
            log.debug("İletişim bildirimi atlandı: mail ayarları tanımlı değil.");
            return;
        }
        ContactMessageResponse m = event.message();
        try {
            sender.send(buildMessage(m));
            log.info("İletişim bildirimi gönderildi (mesaj #{}).", m.id());
        } catch (MailException e) {
            log.error("İletişim bildirimi gönderilemedi (mesaj #{}): {}", m.id(), e.getMessage());
        }
    }

    SimpleMailMessage buildMessage(ContactMessageResponse m) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        if (!from.isBlank()) {
            mail.setFrom(from);
        }
        mail.setReplyTo(oneLine(m.email()));
        mail.setSubject("Yeni mesaj: " + oneLine(m.subject()) + " — " + oneLine(m.name()));
        mail.setText("""
                portofiskirtasiye.com.tr iletişim formundan yeni mesaj

                Ad soyad: %s
                Telefon:  %s
                E-posta:  %s
                Konu:     %s
                Tarih:    %s

                Mesaj:
                %s

                ---
                Bu maile "Yanıtla" ile doğrudan müşteriye cevap verebilirsiniz.
                Mesaj admin panelinde de kayıtlıdır (#%d).
                """.formatted(
                oneLine(m.name()), oneLine(m.phone()), oneLine(m.email()), oneLine(m.subject()),
                m.createdAt() == null ? "—" : DATE_FORMAT.format(m.createdAt()),
                m.message(), m.id()));
        return mail;
    }

    private static String oneLine(String value) {
        return value == null ? "" : value.replaceAll("[\\r\\n]+", " ").trim();
    }
}
