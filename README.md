# Vote App

투표 애플리케이션 초기 버전입니다.

---

## 구성

- **frontend**: React (또는 Nginx + 정적 파일)
- **backend**: Node.js 서버
- **redis**: 투표 수 임시 저장용 Redis 인메모리 데이터베이스 (영속성 있음)

---

## 개발 및 실행 환경

- Docker와 Docker Compose가 설치되어 있음

---

## 사용 방법

1. git clone
```bash
git clone https://github.com/psh1116/vote-app.git
```

2. git clone 한 경로로 이동
```bash
cd "clone 경로/vote-app"
```

3. 컨테이너 빌드 및 실행

```bash
docker compose up --build
```