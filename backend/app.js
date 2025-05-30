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

// 애플리케이션 시작 시 Redis 연결 및 초기 데이터 설정
(async () => {
    try {
        await redisClient.connect();
        await initializeCandidates(); // 후보자 초기화 함수 호출
    } catch (error) {
        console.error('Redis 연결 및 초기화 실패:', error);
        process.exit(1); // 연결 실패 시 앱 종료
    }
})();

app.use(cors());
app.use('/images', express.static('images'));
app.use(express.json());

// 초기 후보자 데이터 (실제 프로젝트에서는 DB에서 로드하거나 관리자 페이지에서 추가)
const INITIAL_CANDIDATES = [
    { id: 1, name: '이재명', image: '1_이재명.jpeg' },
    { id: 2, name: '김문수', image: '2_김문수.jpeg' },
    { id: 3, name: '이준석', image: '4_이준석.jpeg' }, // 이미지 파일명과 ID 매칭 주의
    { id: 4, name: '권영국', image: '5_권영국.jpeg' },
    { id: 5, name: '황교안', image: '7_황교안.jpeg' },
    { id: 6, name: '송진호', image: '8_송진호.jpeg' }
];

// Redis에 후보자 정보를 초기화하는 함수
async function initializeCandidates() {
    console.log('Redis에 후보자 정보 초기화 중...');
    for (const candidate of INITIAL_CANDIDATES) {
        const key = `candidate:${candidate.id}`;
        // 후보자 ID가 이미 존재하지 않는 경우에만 추가
        const exists = await redisClient.exists(key);
        if (!exists) {
            // Redis Hash 타입으로 후보자 정보 저장
            await redisClient.hSet(key, {
                id: candidate.id.toString(), // Redis에 저장할 때 문자열로 변환
                name: candidate.name,
                image: candidate.image
            });
            // 투표수는 별도의 키로 관리 (선택 사항이지만 일관성을 위해 유지)
            await redisClient.set(`candidate:${candidate.id}:votes`, '0');
            console.log(`후보자 ${candidate.name} (${candidate.id}) 초기화됨`);
        } else {
            console.log(`후보자 ${candidate.name} (${candidate.id}) 이미 존재함`);
        }
    }
    console.log('Redis 후보자 정보 초기화 완료.');
}


// 투표 엔드포인트: POST /vote/:candidateId
app.post('/vote/:candidateId', async (req, res) => {
    const candidateId = req.params.candidateId;

    // Redis에 해당 candidateId의 후보자가 실제로 존재하는지 확인
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

// 투표 결과 조회 엔드포인트: GET /votes
app.get('/votes', async (req, res) => {
    try {
        const votes = {};
        const candidateKeys = await redisClient.keys('candidate:*:id'); // 모든 후보자 ID 키 조회
        const candidateIds = candidateKeys.map(key => key.split(':')[1]);

        // 모든 후보자의 득표수를 병렬로 가져옴
        const votePromises = candidateIds.map(id => redisClient.get(`candidate:${id}:votes`));
        const results = await Promise.all(votePromises);

        candidateIds.forEach((id, index) => {
            votes[id] = parseInt(results[index] || '0', 10);
        });

        res.status(200).json(votes);
    } catch (error) {
        console.error('득표수 조회 중 오류 발생:', error);
        res.status(500).send('득표수 조회 중 서버 오류가 발생했습니다.');
    }
});

app.listen(port, () => {
    console.log(`✨ 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});