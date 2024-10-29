package teamteam.basetalk_backend_main.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Status {
    ACTIVE("활성화"),
    INACTIVE("비활성화");

    private final String description;
}
