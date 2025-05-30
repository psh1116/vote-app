# Vote App

투표 애플리케이션 초기 버전입니다.

---

## 구성

- **frontend**: React (또는 Nginx + 정적 파일)
- **backend**: Node.js 서버
- **redis**: 투표 수 임시 저장용 Redis 인메모리 데이터베이스 (영속성 있음)

---

## 개발 및 실행 환경

- Docker와 Docker Compose가 설치되어 있어야 합니다.

---

## 사용 방법

1. 저장소를 클론하거나 프로젝트 폴더로 이동합니다.

2. Docker Compose를 사용해 컨테이너를 빌드 및 실행합니다.

```bash
docker compose up --build
