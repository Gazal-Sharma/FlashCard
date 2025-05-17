import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const ResultPage = ({ score }) => {
  const { width, height } = useWindowSize();

  const confettiTrigger = score >= 90;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {confettiTrigger && (
        <>
          <Confetti
            style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                pointerEvents: "none", 
                zIndex: 0 
            }}
            width={10}
            height={10}
            numberOfPieces={1000}
            recycle={false}
            gravity={0.2}
            initialVelocityX={{ min: 5, max: 10 }}
            origin={{ x: 0, y: 0.5 }}
            colors={['#FFD700', '#FF69B4', '#87CEEB', '#ffffff']}
          />
          <Confetti
            style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                pointerEvents: "none", 
                zIndex: 0 
            }}
            width={width}
            height={height}
            numberOfPieces={1000}
            recycle={false}
            gravity={0.2}
            initialVelocityX={{ min: -10, max: -5 }}
            origin={{ x: 1, y: 0.5 }}
            colors={['#FFD700', '#FF69B4', '#87CEEB', '#ffffff']}
          />
        </>
      )}
    </div>
  );
};

export default ResultPage;