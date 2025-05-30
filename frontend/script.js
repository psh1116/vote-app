document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/candidates') // 백엔드에서 후보 목록 가져오기
        .then(response => response.json())
        .then(candidates => {
            const container = document.getElementById('candidates-container');

            // 🔽 번호 추출 후 정렬
            candidates.sort((a, b) => {
                const numA = parseInt(a.image.split('_')[0], 10);
                const numB = parseInt(b.image.split('_')[0], 10);
                return numA - numB;
            });

            candidates.forEach(candidate => {
                const card = document.createElement('div');
                card.className = 'candidate';

                const img = document.createElement('img');
                img.src = `/images/${candidate.image}`;
                img.alt = candidate.name;
                img.onclick = () => vote(candidate.id);

                const name = document.createElement('p');
                name.textContent = candidate.name;

                card.appendChild(img);
                card.appendChild(name);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('후보 정보를 불러오는 데 실패했습니다:', error);
        });
});

function vote(candidateId) {
    fetch(`http://localhost:3000/vote/${candidateId}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            alert('투표가 완료되었습니다!');
        } else {
            alert('투표 중 문제가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('투표 요청 실패:', error);
        alert('서버 오류로 투표에 실패했습니다.');
    });
}
