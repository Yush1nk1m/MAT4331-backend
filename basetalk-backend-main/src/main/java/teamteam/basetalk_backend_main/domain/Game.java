package teamteam.basetalk_backend_main.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 16, nullable = false)
    private String game_cid = "null";

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private KBOTeam homeTeam = KBOTeam.NONE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KBOTeam awayTeam = KBOTeam.NONE;

    private int homeScore;

    private int awayScore;

    private int predictedHomeScore;

    private int predictedAwayScore;

    @Enumerated(value = EnumType.STRING)
    @Column(nullable = false)
    private GameStatus gameStatus = GameStatus.CONFIRMED;

    @Column(nullable = false)
    private LocalDate gameDate;
}
