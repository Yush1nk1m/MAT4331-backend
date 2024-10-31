# NoSQL DBMS Design Documentation

본 문서는 `Basetalk` 크롤러 서비스의 NoSQL 데이터베이스 설계 문서이다. 크롤러 서비스는 메인 서비스와 별도의 서버에서 운영되며, KBO 경기에 대한 데이터를 수집하여 저장 및 집계한다.

## Required Collections

본 서비스에서 필요한 컬렉션들을 정의한다.

- `Games`: KBO 경기의 기본적인 정보
  - `_id`(ObjectId): MongoDB에서 부여한 오브젝트 고유 식별자
  - `game_id`(string): STATIZ에서 부여한 게임의 고유 식별자
  - `game_date`(Date): 게임 진행 날짜
  - `game_status`(GameStatus): 게임의 진행 상태
  - `home_team`(KBOTeam): 홈 팀
  - `away_team`(KBOTeam): 어웨이 팀
  - `home_score`(number): 홈 팀 점수
  - `away_score`(number): 어웨이 팀 점수
  - `bat_stats_home`(ObjectId): 홈 팀 타격 통계의 참조
  - `bat_stats_away`(ObjectId): 어웨이 팀 타격 통계의 참조
  - `pitch_stats_home`(ObjectId): 홈 팀 투구 통계의 참조
  - `pitch_stats_away`(ObjectId): 어웨이 팀 투구 통계의 참조
- `BatStats`: 팀 타격 통계
  - `_id`(ObjectId): MongoDB에서 부여한 고유 식별자
  - `PA`(number)
  - `AB`(number)
  - `R`(number)
  - `H`(number)
  - `HR`(number)
  - `RBI`(number)
  - `BB`(number)
  - `HBP`(number)
  - `SO`(number)
  - `GO`(number)
  - `FO`(number)
  - `NP`(number)
  - `GDP`(number)
  - `LOB`(number)
  - `AVG`(number)
  - `OPS`(number)
  - `LI`(number)
  - `WPA`(number)
  - `RE24`(number)
- `PitchStats`: 팀 투구 통계
  - `_id`(ObjectId): MongoDB에서 부여한 고유 식별자
  - `IP`(number)
  - `TBF`(number)
  - `H`(number)
  - `R`(number)
  - `ER`(number)
  - `BB`(number)
  - `HBP`(number)
  - `K`(number)
  - `HR`(number)
  - `GO`(number)
  - `FO`(number)
  - `NP`(number)
  - `S`(number)
  - `IR`(number)
  - `IS`(number)
  - `GSC`(number)
  - `ERA`(number)
  - `WHIP`(number)
  - `LI`(number)
  - `WPA`(number)
  - `RE24`(number)
