import React from 'react';
import TenseTraveler from './TenseTraveler';

const TenseTravelerWrapper = ({ onBackToGames }) => {
  const handleReset = () => {
    try {
      localStorage.removeItem('tenseTraveler_highScore');
    } catch (error) {
      console.warn('Failed to reset game state:', error);
    }
  };

  return (
    <TenseTraveler 
      onBackToGames={onBackToGames}
      onReset={handleReset}
    />
  );
};

export default TenseTravelerWrapper;