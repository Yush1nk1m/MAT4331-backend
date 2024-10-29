package teamteam.basetalk_backend_main.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id")
    private Chatroom chatroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String content;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private ChatType type = ChatType.TEXT;

    @Enumerated(value = EnumType.STRING)
    private ChatStatus status;

    private LocalDateTime filteredAt;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    /**
     * Soft delete method
     */
    public void delete() {
        // instead of removing the real data, update the deleted_at column
        deletedAt = LocalDateTime.now();
        // and the status to be deleted
        status = ChatStatus.DELETED;
    }
}
