# Node.js 런타임이 포함된 alpine 이미지를 사용합니다. (경량)
FROM node:alpine

# 컨테이너 내에서 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json (있는 경우) 파일을 복사합니다.
# 이 단계는 npm install이 캐시될 수 있도록 분리합니다.
COPY package.json .

# Node.js 의존성 패키지를 설치합니다.
# --production 플래그를 사용하면 devDependencies는 설치하지 않아 이미지 크기를 줄입니다.
RUN npm install --production

# 나머지 모든 소스 코드를 작업 디렉토리로 복사합니다.
COPY . .

# 애플리케이션이 3000번 포트를 사용함을 외부에 알립니다.
EXPOSE 3000

# 컨테이너가 시작될 때 실행될 명령어를 정의합니다.
CMD ["node", "app.js"]