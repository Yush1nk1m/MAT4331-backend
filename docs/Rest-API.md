# REST API Documentation

이 문서는 `Basetalk`의 백엔드 REST API에 대한 문서이다. 모듈 단위로 API를 구성하였으며, 복잡한 로직에 대해선 시퀀스 다이어그램을 첨부하여 시각적인 이해를 돕는다.

## Auth Module

이 섹션은 인증 관련 모듈의 API에 대한 설명이다.

### Version 1 APIs

|  ID  | Method | URI                                   | Description                                                                                             |
| :--: | :----: | :------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| A-01 |  GET   | /v1/auth/login/oauth2/google          | 사용자를 구글 로그인 페이지로 리다이렉트한다.                                                           |
| A-02 |  GET   | /v1/auth/login/oauth2/google/redirect | 구글 OAuth Provider로부터 사용자 정보를 획득하고 Grant code를 발급하여 리다이렉트한다.                  |
| A-03 |  POST  | /v1/auth/login/oauth2/grant-code      | OAuth 방식으로 로그인 시 리다이렉트된 URI에서 확인할 수 있는 Grant code를 검증하고 JWT 토큰을 생성한다. |
| A-04 |  POST  | /v1/auth/login/local                  | 로컬 로그인 방식으로 사용자를 검증하고 JWT 토큰을 생성한다.                                             |
| A-05 |  POST  | /v1/auth/sign-up/local                | 로컬 회원 가입을 진행하고 가입된 회원의 정보를 반환한다.                                                |
| A-06 |  POST  | /v1/auth/jwt/refresh                  | 리프레시 토큰을 전달받아 검증하고 새로운 액세스 토큰을 생성한다.                                        |

#### [A-01] 구글 로그인 페이지 리다이렉트

- **Request**: URI로 단순 GET 요청을 보낸다.
- **Response**: 구글의 OAuth 로그인 페이지로 리다이렉트한다.
- **Success status code**: 302

#### [A-02] 구글 OAuth Provider로부터 승인받은 리다이렉트 URI

- **Request**: 구글 OAuth Provider가 클라이언트를 해당 endpoint로 리다이렉션하여 사용자 정보를 전달한다.
- **Response**: 클라이언트에게 응답이 제공된다. 이는 서비스의 실제 endpoint로의 리다이렉션으로 구현된다.
- **Success status code**: 302
- **Data format**: URL query parameter
- **Data detail**: `code=[grant code]`

#### [A-03] OAuth 로그인을 위한 Grant code 검증 및 JWT 토큰 발급

- **Request**: `A-02`에서 전달된 grant code를 전송한다.
- **Request body**:

```json
{
  "code": "[grant code]"
}
```

- **Response**: JWT 액세스 토큰과 리프레시 토큰이 제공된다.
- **Success status code**: 200
- **Data format**: Response body
- **Data detail**:

```json
{
  "accessToken": "[JWT access token]",
  "refreshToken": "[JWT refresh token]"
}
```

#### [A-04] 로컬 로그인

- **Request**: 사용자 이메일과 비밀번호를 전달한다.
- **Request body**:

```json
{
  "email": "[member email]",
  "password": "[member password]"
}
```

- **Response**: JWT 액세스 토큰과 리프레시 토큰이 제공된다.
- **Success status code**: 200
- **Data format**: Response body
- **Data detail**:

```json
{
  "accessToken": "[JWT access token]",
  "refreshToken": "[JWT refresh token]"
}
```

#### [A-05] 로컬 회원 가입

- **Request**: 회원 가입에 필요한 사용자의 정보를 전달한다.
- **Request body**: `preferTeam` 속성의 경우 [KBOTeam](../mat4331-basetalk-backend/src/common/types/KBO-team.enum.ts) 타입을 참조하여 그 값을 전달한다.

```json
{
  "email": "[member email]",
  "password": "[member password]",
  "nickname": "[member nickname]",
  "preferTeam": "[KBOTeam enum type]"
}
```

- **Response**: 비밀번호를 제외한 가입한 회원의 정보를 응답한다.
- **Success status code**: 201
- **Data format**: Response body
- **Data detail**:

```json
{
  "id": "[member id]",
  "email": "[member email]",
  "nickname": "[member email]",
  "preferTeam": "[KBOTeam enum type]"
}
```

#### [A-06] 액세스 토큰 리프레시

- **Request**: 사용자의 리프레시 토큰을 전달한다.
- **Request body**:

```json
{
  "refreshToken": "[JWT refresh token]"
}
```

- **Response**: 새롭게 생성된 액세스 토큰을 응답한다.
- **Success status code**: 201
- **Data format**: Response body
- **Data detail**:

```json
{
  "accessToken": "[issued access token]"
}
```

#### [A-07] 로그아웃

- **Request**: 사용자의 액세스 토큰을 전달한다.
- **Request header**: Bearer authorization
- **Response**: 어떤 데이터도 응답하지 않는다. 멱등성을 만족한다.
- **Success status code**: 204

### Appendix. OAuth Login Process

이 별첨 섹션은 시퀀스 다이어그램을 통해 OAuth를 통한 로그인 과정이 어떻게 이루어지는지에 대한 이해를 시각적으로 돕는다. 전체적인 과정을 묘사해 두었기 때문에 클라이언트의 시각에서 보고자 한다면 클라이언트로부터 나가는 요청과 클라이언트로 들어오는 요청이 어떤 것인지만 확인하면 된다.

![OAuth Login Process](images/OAuth_Login.png)

## Chatroom Module

이 섹션은 채팅방 관련 모듈 API에 대한 설명이다.

### Version 1 APIs

|  ID   | Method | URI                             | Description                                |
| :---: | :----: | :------------------------------ | :----------------------------------------- |
| CR-01 |  POST  | /v1/chatrooms                   | 특정 경기에 대한 새로운 채팅방을 생성한다. |
| CR-02 |  POST  | /v1/chatrooms/:chatroomId/join  | 채팅방에 입장한다.                         |
| CR-03 |  POST  | /v1/chatrooms/:chatroomId/leave | 채팅방에서 퇴장한다.                       |

#### [CR-01] 채팅방 생성

- **Request**: 사용자의 액세스 토큰, 경기 ID(크롤링 ID가 아닌 DB ID), 채팅방 제목, 선호 팀 정보를 전달한다.
- **Request header**: Bearer authorization
- **Request body**:

```json
{
  "gameId": "[game id]",
  "title": "[chatroom title]",
  "preferTeam": "[KBOTeam enum type]"
}
```

- **Response**: 새롭게 생성된 채팅방 정보를 응답한다.
- **Success status code**: 201
- **Data format**: Response body
- **Data detail**:

```json
{
  "id": "[chatroom id]",
  "title": "[chatroom title]",
  "preferTeam": "[KBOTeam enum type]",
  "participantCount": "[number of chatroom's participant]",
  "createdAt": "[created date]"
}
```

#### [CR-02] 채팅방 입장

- **Request**: 사용자의 액세스 토큰과 채팅방의 ID를 전달한다.
- **Request header**: Bearer authorization
- **Request URI parameter**: 테이블의 API URI 참조

- **Response**: 어떤 데이터도 응답하지 않는다. 멱등성을 만족한다.
- **Success status code**: 204

#### [CR-03] 채팅방 퇴장

- **Request**: 사용자의 액세스 토큰과 채팅방의 ID를 전달한다.
- **Request header**: Bearer authorization
- **Request URI parameter**: 테이블의 API URI 참조

- **Response**: 어떤 데이터도 응답하지 않는다. 멱등성을 만족한다.
- **Success status code**: 204