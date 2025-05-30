// redisInit.js
const redisClient = require('./redisClient');

const INITIAL_CANDIDATES = [
    { id: 1, name: '이재명', image: '1_이재명.jpeg' },
    { id: 2, name: '김문수', image: '2_김문수.jpeg' },
    { id: 3, name: '이준석', image: '4_이준석.jpeg' },
    { id: 4, name: '권영국', image: '5_권영국.jpeg' },
    { id: 5, name: '황교안', image: '7_황교안.jpeg' },
    { id: 6, name: '송진호', image: '8_송진호.jpeg' }
];

async function initializeCandidates() {
    await redisClient.connect();

    for (const candidate of INITIAL_CANDIDATES) {
        const key = `candidate:${candidate.id}`;
        const exists = await redisClient.exists(key);
        if (!exists) {
            await redisClient.hSet(key, {
                id: candidate.id.toString(),
                name: candidate.name,
                image: candidate.image
            });
            await redisClient.set(`candidate:${candidate.id}:votes`, '0');
            console.log(`✅ 후보자 ${candidate.name} 초기화 완료`);
        } else {
            console.log(`ℹ️ 후보자 ${candidate.name} 이미 존재`);
        }
    }

    await redisClient.quit();
}

initializeCandidates().then(() => {
    console.log('✅ Redis 후보자 초기화 완료');
    process.exit(0);
}).catch((err) => {
    console.error('❌ 초기화 오류:', err);
    process.exit(1);
});
