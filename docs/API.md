# API Documentation

이 문서는 `Basetalk`의 백엔드 API에 대한 문서이다. 모듈 단위로 API를 구성하였으며, 복잡한 로직에 대해선 시퀀스 다이어그램을 첨부하여 시각적인 이해를 돕는다.

## Auth Module

이 섹션은 인증 관련 모듈의 API에 대한 설명이다.

### Version 1 APIs

|  ID  | Method | URI                                   | Description                                                                |
| :--: | :----: | :------------------------------------ | :------------------------------------------------------------------------- |
| A-01 |  GET   | /auth/v1/login/oauth2/google          | 구글 로그인 페이지로 리다이렉트한다.                                       |
| A-02 |  GET   | /auth/v1/login/oauth2/google/redirect | 승인된 리다이렉트 URI, 구글 OAuth Provider로부터 사용자 정보를 제공받는다. |
