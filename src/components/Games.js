import React, { useState } from 'react';
import GameSelector from './games/GameSelector';
import WordDropChallenge from './games/WordDropChallenge';
import MarkTheWords from './games/MarkTheWords';
import Dragzilla from './games/Dragzilla';
import IdiomMatcher from './games/IdiomMatcher';
import WordTileGame from './games/WordTileGame';
import Crossroads from './games/Crossroads';

const Games = ({ onBackToStart, initialGame }) => {
  const [selectedGame, setSelectedGame] = useState(initialGame || null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  if (selectedGame === 'wordDrop') {
    return <WordDropChallenge onBackToGames={handleBackToGames} />;
  }
  if (selectedGame === 'markTheWords') {
    return <MarkTheWords onBackToGames={handleBackToGames} />;
  }
if (selectedGame === 'dragzilla') {
  return <Dragzilla onBackToGames={handleBackToGames} />;
}
if (selectedGame === 'idiomMatcher') {
  return <IdiomMatcher onBackToGames={handleBackToGames} />;
}
if (selectedGame === 'wordTileGame') {
  return <WordTileGame onBackToGames={handleBackToGames} />;
}

if (selectedGame === 'crossroads') {
  return <Crossroads onBackToGames={handleBackToGames} />;
}



  return <GameSelector onGameSelect={handleGameSelect} onBackToStart={onBackToStart} />;
};

export default Games;