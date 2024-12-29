import { useState, useEffect, useCallback } from 'react';
import LoadingAnimation from '../components/LoadingAnimation';
import './Home.css';

function Home() {
  const [lottoHistory, setLottoHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictedFrequentNumbers, setPredictedFrequentNumbers] = useState(null);
  const [predictedRareNumbers, setPredictedRareNumbers] = useState(null);
  const [numberFrequency, setNumberFrequency] = useState(null);

  const calculateFrequency = (history) => {
    const allNumbers = history.flatMap(lotto => [...lotto.numbers, lotto.bonusNumber]);
    
    const frequencyMap = new Map();
    for (let i = 1; i <= 45; i++) {
      frequencyMap.set(i, allNumbers.filter(num => num === i).length);
    }
    
    const sortedNumbers = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      mostFrequent: sortedNumbers.slice(0, 5),
      leastFrequent: sortedNumbers.slice(-5)
    };
  };

  const fetchLatestLottoNumbers = useCallback(async () => {
    setIsLoading(true);
    try {
      const latestRound = 1152;
      const historyPromises = [];
      
      for(let i = 0; i < 100; i++) {
        const roundNumber = latestRound - i;
        historyPromises.push(
          fetch(`/common.do?method=getLottoNumber&drwNo=${roundNumber}`)
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

      setLottoHistory(history);
      setNumberFrequency(calculateFrequency(history));
    } catch (error) {
      console.error('로또 정보를 가져오는데 실패했습니다:', error);
    }
    setIsLoading(false);
  }, []);

  const handlePrediction = useCallback(() => {
    const allNumbers = lottoHistory.flatMap(lotto => [...lotto.numbers, lotto.bonusNumber]);
    
    const frequencyMap = new Map();
    for (let i = 1; i <= 45; i++) {
      frequencyMap.set(i, allNumbers.filter(num => num === i).length);
    }
    
    const sortedNumbers = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const mostFrequent = sortedNumbers
      .slice(0, 20)
      .map(entry => entry[0]);
    
    const leastFrequent = sortedNumbers
      .slice(-20)
      .map(entry => entry[0]);
    
    const frequentNumbers = new Set();
    const rareNumbers = new Set();

    while (frequentNumbers.size < 6) {
      const randomIndex = Math.floor(Math.random() * mostFrequent.length);
      frequentNumbers.add(mostFrequent[randomIndex]);
    }

    while (rareNumbers.size < 6) {
      const randomIndex = Math.floor(Math.random() * leastFrequent.length);
      rareNumbers.add(leastFrequent[randomIndex]);
    }
    
    setPredictedFrequentNumbers([...frequentNumbers].sort((a, b) => a - b));
    setPredictedRareNumbers([...rareNumbers].sort((a, b) => a - b));
  }, [lottoHistory]);

  useEffect(() => {
    fetchLatestLottoNumbers();
  }, [fetchLatestLottoNumbers]);

  return (
    <div className="content-container">
      <div className="hero-section">
        <h1>🎲 로또 번호 분석</h1>
        <p className="subtitle">AI 기반 분석으로 최적의 번호 조합을 추천해드립니다</p>
      </div>

      <div className="prediction-section">
        <div className="prediction-card">
          <div className="prediction-header">
            <div className="prediction-title">
              <h2>번호 예측하기</h2>
              <div className="prediction-badge">AI 분석</div>
            </div>
            <p className="prediction-description">
              최근 100회차의 당첨 데이터를 분석하여
              <br />두 가지 타입의 번호를 추천해드립니다
            </p>
          </div>
          
          <button 
            className="predict-button"
            onClick={handlePrediction}
          >
            <span className="button-icon">🎯</span>
            번호 추천받기
          </button>
          
          {predictedFrequentNumbers && (
            <div className="predictions-container">
              <div className="predicted-numbers-container">
                <h3>자주 나오는 번호 조합</h3>
                <p className="prediction-description">최근 100회차에서 가장 빈번하게 등장한 번호들의 조합입니다.</p>
                <div className="predicted-numbers">
                  {predictedFrequentNumbers.map((number, index) => (
                    <span key={index} className={`lotto-ball number-${Math.ceil(number/10)}`}>
                      {number}
                    </span>
                  ))}
                </div>
              </div>

              <div className="predicted-numbers-container">
                <h3>희귀 번호 조합</h3>
                <p className="prediction-description">최근 100회차에서 가장 적게 등장한 번호들의 조합입니다.</p>
                <div className="predicted-numbers">
                  {predictedRareNumbers.map((number, index) => (
                    <span key={index} className={`lotto-ball number-${Math.ceil(number/10)}`}>
                      {number}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="frequency-analysis">
            <div className="frequency-box">
              <h4>가장 자주 나온 번호 TOP 5</h4>
              <div className="frequency-numbers">
                {numberFrequency && numberFrequency.mostFrequent.map(([number, count], index) => (
                  <div key={index} className="frequency-item">
                    <span className={`lotto-ball number-${Math.ceil(number/10)}`}>
                      {number}
                    </span>
                    <span className="frequency-count">{count}회</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="frequency-box">
              <h4>가장 적게 나온 번호 TOP 5</h4>
              <div className="frequency-numbers">
                {numberFrequency && numberFrequency.leastFrequent.map(([number, count], index) => (
                  <div key={index} className="frequency-item">
                    <span className={`lotto-ball number-${Math.ceil(number/10)}`}>
                      {number}
                    </span>
                    <span className="frequency-count">{count}회</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className="history-section">
          <h2>최근 당첨 번호</h2>
          <div className="history-grid">
            {lottoHistory.slice(0, 10).map((lotto) => (
              <div key={lotto.drwNo} className="history-card">
                <div className="card-header">
                  <h4>{lotto.drwNo}회차</h4>
                  <span className="draw-date">{lotto.drwNoDate}</span>
                </div>
                <div className="numbers-container">
                  {lotto.numbers.map((number, index) => (
                    <span key={index} className={`lotto-ball number-${Math.ceil(number/10)}`}>
                      {number}
                    </span>
                  ))}
                  <span className="plus">+</span>
                  <span className={`lotto-ball bonus number-${Math.ceil(lotto.bonusNumber/10)}`}>
                    {lotto.bonusNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 