const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 3000;

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

redisClient.on('connect', () => console.log('✅ Redis에 성공적으로 연결되었습니다.'));
redisClient.on('error', err => console.error('❌ Redis 연결 오류:', err));

// Redis 연결
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Redis 연결 실패:', error);
        process.exit(1);
    }
})();

app.use(cors());
app.use('/images', express.static('images'));
app.use(express.json());

// 투표 엔드포인트: POST /vote/:candidateId
app.post('/vote/:candidateId', async (req, res) => {
    const candidateId = req.params.candidateId;

    const candidateExists = await redisClient.exists(`candidate:${candidateId}`);
    if (!candidateExists) {
        return res.status(404).send('존재하지 않는 후보 ID입니다.');
    }

    try {
        const newCount = await redisClient.incr(`candidate:${candidateId}:votes`);
        console.log(`후보 ${candidateId} 득표수: ${newCount}`);
        res.status(200).send('투표 성공');
    } catch (error) {
        console.error(`후보 ${candidateId} 투표 중 오류 발생:`, error);
        res.status(500).send('투표 처리 중 서버 오류가 발생했습니다.');
    }
});

// 후보자 목록 조회: GET /candidates
app.get('/candidates', async (req, res) => {
    try {
        const candidateKeys = await redisClient.keys('candidate:*');
        const filteredKeys = candidateKeys.filter(key => !key.endsWith(':votes'));

        const candidates = [];

        for (const key of filteredKeys) {
            const candidateInfo = await redisClient.hGetAll(key);
            if (Object.keys(candidateInfo).length > 0) {
                candidates.push({
                    id: parseInt(candidateInfo.id, 10),
                    name: candidateInfo.name,
                    image: candidateInfo.image
                });
            }
        }

        console.log(`후보자 수: ${candidates.length}`);
        res.status(200).json(candidates);
    } catch (error) {
        console.error('후보자 정보 조회 중 오류 발생:', error);
        res.status(500).send('후보자 정보 조회 중 서버 오류가 발생했습니다.');
    }
});

// 득표수 조회: GET /votes
app.get('/votes', async (req, res) => {
    try {
        const voteKeys = await redisClient.keys('candidate:*:votes');
        const votes = {};

        for (const key of voteKeys) {
            const id = key.split(':')[1]; // candidate:1:votes -> 1
            const count = await redisClient.get(key);
            votes[id] = parseInt(count || '0', 10);
        }

        res.status(200).json(votes);
    } catch (error) {
        console.error('득표수 조회 중 오류 발생:', error);
        res.status(500).send('득표수 조회 중 서버 오류가 발생했습니다.');
    }
});

app.listen(port, () => {
    console.log(`✨ 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
