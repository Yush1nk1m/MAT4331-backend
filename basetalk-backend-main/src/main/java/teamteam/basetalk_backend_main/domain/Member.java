package teamteam.basetalk_backend_main.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64, unique = true)
    private String email;

    @Column(nullable = false, length = 64)
    private String password;

    @Column(nullable = false, length = 20)
    private String nickname = "빈 닉네임";

    private String bio;


    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private KBOTeam preferTeam = KBOTeam.NONE;
    private String profile;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private MemberType type;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private LocalDateTime deletedAt;

    /**
     * One-to-Many relationship with MemberChatroom
     */
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<MemberChatroom> joinedChatroomList = new ArrayList<>();

    /**
     * One-to-Many relationship with Chat
     */
    @OneToMany(mappedBy = "member")
    private List<Chat> chatList = new ArrayList<>();

    /**
     * Soft delete method
     */
    public void delete() {
        // instead of removing data, just update the deleted_at column
        this.deletedAt = LocalDateTime.now();
        // and the status column to inactive
        this.status = Status.INACTIVE;
    }
}
