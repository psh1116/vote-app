#!/bin/sh
set -e

echo "🔧 Redis 초기화 실행..."
node redisInit.js

echo "🚀 서버 시작..."
exec node app.js