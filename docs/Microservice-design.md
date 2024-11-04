# Microservice Design Documentation

이 문서는 `Basetalk`의 마이크로서비스 간 정의된 이벤트 및 이벤트 핸들링을 시퀀스 다이어그램을 통해 시각화하여 마이크로서비스 간 통신이 어떻게 발생하는지에 대한 이해를 돕는 설계 문서이다.

## Microservices

`Basetalk`에서 정의된 마이크로서비스들은 다음과 같다. 마이크로서비스들은 중간에 `RabbitMQ`를 메시지 브로커로 매개하여 이벤트 기반으로 통신한다.

![Microservices](images/Microservice_Architecture.png)

### Main service

`Basetalk`의 사용자 정보, KBO 경기 정보, 채팅 정보 등을 총체적으로 관리하는 메인 서비스이다. `NestJS`로 구현되어 있으며 `Crawler service`와 `AI service`의 중간에서 두 마이크로서비스와 양방향 통신을 수행한다.

### Crawler service

`Basetalk`의 KBO 경기 정보를 `STATIZ` 플랫폼을 통해 수집하는 크롤링 서비스이다. `NestJS`로 구현되어 있으며 `Main service`와 양방향 통신을 수행한다.

### AI service

`Basetalk`의 비즈니스 로직에 필요한 AI 모델들을 통합하는 서비스이다. `FastAPI`로 구현되어 있으며 `Main service`와 양방향 통신을 수행한다.

## Events

`Basetalk`의 마이크로서비스들 간 정의된 이벤트는 다음과 같다.

| Event ID | Event Name   |     Source      | Destination  | Description                    |
| :------: | :----------- | :-------------: | :----------: | :----------------------------- |
|   E-01   | Game.Updated | Crawler service | Main service | 업데이트된 경기 정보를 알린다. |

## Events Detail

이 섹션은 정의된 이벤트들의 동작에 대한 이해를 시각적으로 이해하기 위한 것이다. 여러 개의 비즈니스 로직이 같은 이벤트를 사용할 수도 있으나 기본적인 논리는 같다.

### [E-01]: 연간 게임 데이터 크롤링 요청 및 게임 정보 갱신

크롤링 서비스가 하루에 한 번씩 주기적으로 연간 게임 데이터를 수집한다. 수집한 이후 업데이트된 게임 데이터가 있을 경우 이를 메인 서비스에 `E-01` 이벤트로 알리면서 업데이트된 데이터를 전송한다.

![Event1: [E-01]](images/Event1.png)
