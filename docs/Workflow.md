# Workflow Planning Documentation

이 문서는 `Basetalk` 백엔드 애플리케이션의 기능 구현 계획에 관한 문서이다.

## Main App

이 섹션은 `Basetalk`의 백엔드 메인 애플리케이션의 기능 구현 계획에 대해 기술한다.

### 인증 관련 기능

- [x] Google OAuth2 인증
- [ ] 로그인(JWT, Session cookie 중 선택 필요)
- [ ] Kakao OAuth2 인증
- [ ] Naver OAuth2 인증

### 경기 관련 기능

- [ ] 메시지 큐로 크롤링 서비스로부터 경기 정보 받아오기
- [ ] 승패 예측 AI 모델 통합

### 사용자 관련 기능

- [ ] 기본적인 CRUD API

### 채팅 관련 기능

- [ ] Web Socket 사용한 기본적인 채팅
- [ ] 기본적인 CRUD API
- [ ] 비속어 판별 AI 모델 통합
- [ ] Web Socket & Redis 연동하여 Scalable하게 확장

## Crawler App

이 섹션은 `Basetalk`의 KBO 크롤링 마이크로서비스 애플리케이션의 기능 구현 계획에 대해 기술한다.

### 경기 관련 기능

- [ ] KBO 연간 게임 정보를 전체 수집하는 On-demand API
- [ ] Home/Away 조합의 누적 평균 통계량을 제공하는 API
- [ ] 주기적으로 오늘의 경기 정보를 수집하는 API(수 분 또는 수 시간 단위)
- [ ] 메시지 큐로 수집한 정보를 전송하기
- [ ] 주기적으로 전날의 경기 정보를 수집하는 API(일 단위)

## AI App

이 섹션은 `Basetalk`의 인공지능 마이크로서비스 애플리케이션의 기능 구현 계획에 대해 기술한다.

### Common

- [ ] API 스켈레톤 코드 구현 및 과제 할당
- [ ] AI 모델 통합
