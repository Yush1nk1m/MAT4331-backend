package teamteam.basetalk_backend_main.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum GameStatus {
    CANCELED("경기 취소"),
    CONFIRMED("경기 진행");

    private final String description;
}
