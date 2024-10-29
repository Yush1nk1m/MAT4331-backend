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
public class Chatroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(length = 20, nullable = false)
    private String title;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private KBOTeam preferTeam = KBOTeam.NONE;

    @Column(nullable = false)
    private Long participantCount = 0L;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * One-to-Many relationship with MemberChatroom
     */
    @OneToMany(mappedBy = "chatroom", cascade = CascadeType.ALL)
    private List<MemberChatroom> joinedMemberList = new ArrayList<>();

    /**
     * One-to-Many relationship with Chat
     */
    @OneToMany(mappedBy = "chatroom")
    private List<Chat> chatList = new ArrayList<>();
}
