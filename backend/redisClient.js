// redisClient.js
const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

redisClient.on('connect', () => console.log('✅ Redis 연결 성공'));
redisClient.on('error', err => console.error('❌ Redis 연결 오류:', err));

module.exports = redisClient;