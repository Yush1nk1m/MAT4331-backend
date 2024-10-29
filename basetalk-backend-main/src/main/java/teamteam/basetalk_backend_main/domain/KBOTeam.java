package teamteam.basetalk_backend_main.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum KBOTeam {
    LG("LG"),
    KT("KT"),
    SSG("SSG"),
    NC("NC"),
    DOOSAN("두산"),
    KIA("KIA"),
    LOTTE("롯데"),
    SAMSUNG("삼성"),
    HANHWA("한화"),
    KIWOOM("키움"),
    NONE("없음");

    private final String description;
}
