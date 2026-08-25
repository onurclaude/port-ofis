package com.portofis.backend.repository;

import com.portofis.backend.entity.ContactMessageEntity;
import com.portofis.backend.entity.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, Long> {

    Page<ContactMessageEntity> findByStatusOrderByCreatedAtDesc(ContactMessageStatus status, Pageable pageable);

    @Query("SELECT c FROM ContactMessageEntity c ORDER BY "
            + "CASE WHEN c.status = com.portofis.backend.entity.ContactMessageStatus.NEW THEN 0 ELSE 1 END ASC, "
            + "c.createdAt DESC")
    Page<ContactMessageEntity> findAllOrderedByUnreadFirstThenNewest(Pageable pageable);
}
