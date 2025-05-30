# Vote App

투표 애플리케이션 초기 버전입니다.

---

## 구성

- **frontend**: React (또는 Nginx + 정적 파일)
- **backend**: Node.js 서버
- **redis**: 투표 수 임시 저장용 Redis 인메모리 데이터베이스 (데이터 영속성 보장)

---

## 개발 및 실행 환경

- Docker와 Docker Compose가 설치되어 있어야 합니다.

---

## 사용 방법

1. Git 저장소 클론

```bash
git clone https://github.com/psh1116/vote-app.git
```

2. 클론한 경로로 이동

```bash
cd vote-app
```


3. Docker 컨테이너 빌드 및 실행

```bash
docker compose up --build
```

4. 서비스 접속
- 프론트엔드 : http://localhost
- 백엔드 API : http://localhost:3000

## 기타 정보
- Redis 데이터는 redis_data라는 DOcker 볼륨에 저장
- Docker compose 실행 시 vote-app0-network 네트워크가 자동 생성되서 서비스 간 통신 가능하게 함

## 중지 및 정리
실행중인 컨테이너 중지 명령어
```bash
docker compose down
```