import { useEffect, useState } from 'react';
import './LoadingAnimation.css';

function LoadingAnimation() {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const containerWidth = document.querySelector('.loading-animation').clientWidth;
    const containerHeight = document.querySelector('.loading-animation').clientHeight;
    
    // 컨테이너의 정중앙 좌표 계산
    const centerX = (containerWidth / 2) - 20;  // 공 크기(40px)의 절반을 빼줌
    const centerY = (containerHeight / 2) - 20;

    // 초기 무작위 위치의 숫자들 생성
    const initialNumbers = Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      // 화면 전체에 걸쳐 무작위 위치 생성
      x: Math.random() * (containerWidth - 100),
      y: Math.random() * (containerHeight - 100),
    }));
    setNumbers(initialNumbers);

    // 1초 후에 중앙으로 모이는 애니메이션 시작
    const timer = setTimeout(() => {
      setNumbers(prevNumbers => 
        prevNumbers.map(num => ({
          ...num,
          x: centerX,
          y: centerY,
        }))
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loading-animation">
      <div className="animation-container">
        {numbers.map((number) => (
          <div
            key={number.id}
            className="floating-ball"
            style={{
              transform: `translate(${number.x}px, ${number.y}px)`,
            }}
          >
            {number.id}
          </div>
        ))}
      </div>
      <div className="loading-text">로또 정보를 불러오는 중입니다...</div>
    </div>
  );
}

export default LoadingAnimation; 