import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

const IdiomMatcher = ({ onBackToGames }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for first level
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [powerUps, setPowerUps] = useState({
    freeze: 2,
    skip: 2,
    shuffle: 2
  });

  // Sample data structure (replace with actual data when provided)
  const levelData = {
    1: [
      { id: 1, idiom: "Break a leg", definition: "Good luck" },
      { id: 2, idiom: "Piece of cake", definition: "Very easy to do" },
      { id: 3, idiom: "Hit the books", definition: "Study hard" },
      { id: 4, idiom: "Under the weather", definition: "Feeling sick" },
      { id: 5, idiom: "Cost an arm and a leg", definition: "Very expensive" }
    ]
  };

  const [currentPairs, setCurrentPairs] = useState([]);
  const [definitions, setDefinitions] = useState([]);

  useEffect(() => {
    // Initialize level
    const pairs = levelData[level] || [];
    setCurrentPairs([...pairs]);
    setDefinitions([...pairs].sort(() => Math.random() - 0.5).map(p => p.definition));
  }, [level]);

  // Timer effect
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleItemClick = (item, type) => {
    if (gameStatus !== 'playing') return;

    if (!selectedItem) {
      setSelectedItem({ ...item, type });
      return;
    }

    if (selectedItem.type === type) {
      setSelectedItem(null);
      return;
    }

    // Check match
    const isMatch = type === 'definition' 
      ? selectedItem.definition === item
      : selectedItem === item;

    if (isMatch) {
      handleCorrectMatch(type === 'definition' ? selectedItem.idiom : item);
    } else {
      handleIncorrectMatch();
    }
    setSelectedItem(null);
  };

  const handleCorrectMatch = (idiom) => {
    const audioCorrect = new Audio('/correct.mp3'); // Add sound file
    audioCorrect.play().catch(() => {}); // Ignore if audio fails to play
    
    setMatchedPairs(prev => [...prev, idiom]);
    setScore(prev => prev + (10 * (streak + 1))); // Base score * streak multiplier
    setStreak(prev => prev + 1);
    
    if (matchedPairs.length + 1 === levelData[level].length) {
      handleLevelComplete();
    }
  };

  const handleIncorrectMatch = () => {
    const audioIncorrect = new Audio('/incorrect.mp3'); // Add sound file
    audioIncorrect.play().catch(() => {});
    
    setStreak(0);
  };

  const handleLevelComplete = () => {
    if (level === 3) {
      setGameStatus('won');
    } else {
      setLevel(prev => prev + 1);
      setTimeLeft(prev => Math.max(prev - 30, 60)); // Reduce time by 30s, minimum 60s
      setMatchedPairs([]);
    }
  };

  const handlePowerUp = (type) => {
    if (powerUps[type] <= 0 || gameStatus !== 'playing') return;
    
    setPowerUps(prev => ({
      ...prev,
      [type]: prev[type] - 1
    }));

    switch (type) {
      case 'freeze':
        // Pause timer for 5 seconds
        setGameStatus('frozen');
        setTimeout(() => setGameStatus('playing'), 5000);
        break;
      case 'shuffle':
        setDefinitions(prev => [...prev].sort(() => Math.random() - 0.5));
        break;
      case 'skip':
        // Skip current pair if one is selected
        if (selectedItem) {
          setSelectedItem(null);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToGames}
            className="btn btn-outline"
          >
            ← Back to Games
          </button>
          <div className="flex gap-4 items-center">
            <motion.div
              className="bg-white px-4 py-2 rounded-lg shadow-sm"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, times: [0, 0.5, 1] }}
            >
              Score: {score}
            </motion.div>
            <motion.div
              className="bg-white px-4 py-2 rounded-lg shadow-sm"
              animate={{ color: streak > 0 ? '#7C3AED' : '#000000' }}
            >
              Streak: {streak}
            </motion.div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              Level: {level}
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Power-ups */}
        <div className="flex justify-center gap-4 mb-8">
          {Object.entries(powerUps).map(([type, count]) => (
            <button
              key={type}
              onClick={() => handlePowerUp(type)}
              disabled={count <= 0}
              className={`px-4 py-2 rounded-lg shadow-sm transition-all
                ${count > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300'}
              `}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <motion.div
          className="grid grid-cols-2 gap-8"
          ref={constraintsRef}
        >
          {/* Idioms Column */}
          <div className="space-y-4">
            {currentPairs.map((pair) => (
              <motion.div
                key={pair.id}
                drag={!matchedPairs.includes(pair.idiom)}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragStart={() => {
                  setIsDragging(true);
                  setDraggedItem(pair);
                }}
                onDragEnd={() => {
                  setIsDragging(false);
                  setDraggedItem(null);
                }}
                onClick={() => !matchedPairs.includes(pair.idiom) && !isDragging && handleItemClick(pair, 'idiom')}
                className={`w-full p-4 rounded-lg shadow-sm transition-all cursor-grab active:cursor-grabbing
                  ${matchedPairs.includes(pair.idiom)
                    ? 'bg-green-100 cursor-default'
                    : selectedItem?.idiom === pair.idiom
                    ? 'bg-blue-100'
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
                whileHover={!matchedPairs.includes(pair.idiom) ? { scale: 1.02 } : {}}
                whileDrag={{
                  scale: 1.1,
                  zIndex: 20,
                  opacity: 0.8,
                  transition: { duration: 0.2 }
                }}
              >
                {pair.idiom}
              </motion.div>
            ))}
          </div>

          {/* Definitions Column */}
          <div className="space-y-4">
            {definitions.map((definition, index) => {
              const isMatched = matchedPairs.some(idiom =>
                levelData[level].find(p => p.idiom === idiom)?.definition === definition
              );
              
              return (
                <motion.div
                  key={index}
                  onClick={() => !isMatched && !isDragging && handleItemClick(definition, 'definition')}
                  onMouseUp={() => {
                    if (isDragging && draggedItem && !isMatched) {
                      const isMatch = draggedItem.definition === definition;
                      if (isMatch) {
                        handleCorrectMatch(draggedItem.idiom);
                      } else {
                        handleIncorrectMatch();
                      }
                    }
                  }}
                  className={`w-full p-4 rounded-lg shadow-sm transition-all
                    ${isMatched
                      ? 'bg-green-100 cursor-default'
                      : selectedItem?.definition === definition
                      ? 'bg-blue-100'
                      : isDragging
                      ? 'bg-indigo-50 border-2 border-dashed border-indigo-300'
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                  whileHover={!isMatched ? { scale: 1.02 } : {}}
                >
                  {definition}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameStatus !== 'playing' && gameStatus !== 'frozen' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {gameStatus === 'won' ? 'Congratulations!' : 'Game Over'}
                </h2>
                <p className="text-xl mb-4">Final Score: {score}</p>
                <button
                  onClick={onBackToGames}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Back to Games
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IdiomMatcher;