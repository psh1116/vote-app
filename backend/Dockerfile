FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

# start.sh를 컨테이너에 복사
COPY start.sh .

# 실행 권한 부여 (리눅스 환경에서 필수!)
RUN chmod +x start.sh

EXPOSE 3000

# start.sh를 실행하도록 변경
CMD ["./start.sh"]
