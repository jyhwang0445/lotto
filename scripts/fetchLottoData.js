
const fetch = require('node-fetch');
const fs = require('fs');

async function fetchLottoData() {
  try {
    const latestRound = 1152; // 최신 회차
    const historyPromises = [];
    
    for(let i = 0; i < 100; i++) {
      const roundNumber = latestRound - i;
      historyPromises.push(
        fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${roundNumber}`)
          .then(res => res.json())
      );
    }

    const results = await Promise.all(historyPromises);
    const history = results
      .filter(data => data.returnValue === 'success')
      .map(data => ({
        drwNo: data.drwNo,
        drwNoDate: data.drwNoDate,
        numbers: [
          data.drwtNo1,
          data.drwtNo2,
          data.drwtNo3,
          data.drwtNo4,
          data.drwtNo5,
          data.drwtNo6
        ],
        bonusNumber: data.bnusNo
      }));

    // 데이터를 파일로 저장
    const fileContent = `export const lottoHistory = ${JSON.stringify(history, null, 2)};`;
    fs.writeFileSync('./src/data/lottoData.js', fileContent);
    
    console.log('로또 데이터가 성공적으로 저장되었습니다.');
  } catch (error) {
    console.error('데이터 수집 중 오류 발생:', error);
  }
}

fetchLottoData();