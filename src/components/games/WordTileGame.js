import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Game logic utilities
const gameUtils = {
  // Check if the sentence is correctly arranged
  isSentenceCorrect: (currentWords, correctWords) => {
    if (currentWords.length !== correctWords.length) return false;
    return currentWords.every((word, index) => word === correctWords[index]);
  }
};

const sentences = [
  {
    jumbled: ["cat", "the", "sat", "mat", "on", "the"],
    correct: ["the", "cat", "sat", "on", "the", "mat"],
    chunks: [
      { words: ["the", "cat"], type: "N" },
      { words: ["sat"], type: "V" },
      { words: ["on", "the", "mat"], type: "P" }
    ]
  },
  {
    jumbled: ["ran", "dog", "the", "fast"],
    correct: ["the", "dog", "ran", "fast"],
    chunks: [
      { words: ["the", "dog"], type: "N" },
      { words: ["ran", "fast"], type: "V" }
    ]
  },
  {
    jumbled: ["quickly", "ran", "dog", "the", "park", "the", "in"],
    correct: ["the", "dog", "ran", "quickly", "in", "the", "park"],
    chunks: [
      { words: ["the", "dog"], type: "N" },
      { words: ["ran", "quickly"], type: "V" },
      { words: ["in", "the", "park"], type: "P" }
    ]
  },
  {
    jumbled: ["birds", "beautiful", "the", "trees", "tall", "in", "sang", "the"],
    correct: ["the", "beautiful", "birds", "sang", "in", "the", "tall", "trees"],
    chunks: [
      { words: ["the", "beautiful", "birds"], type: "N" },
      { words: ["sang"], type: "V" },
      { words: ["in", "the", "tall", "trees"], type: "P" }
    ]
  },
  {
    jumbled: ["excitedly", "letter", "friend", "her", "wrote", "she", "to", "best", "her", "morning", "this"],
    correct: ["she", "excitedly", "wrote", "a", "letter", "to", "her", "best", "friend", "this", "morning"],
    chunks: [
      { words: ["she"], type: "N" },
      { words: ["excitedly", "wrote"], type: "V" },
      { words: ["a", "letter"], type: "N" },
      { words: ["to", "her", "best", "friend"], type: "P" },
      { words: ["this", "morning"], type: "P" }
    ]
  }
];

// Component to display a word tile
const WordTile = ({ word, type, isDragging, onDragStart, className, ...props }) => (
  <motion.div
    className={`${className} shadow-lg rounded-lg px-6 py-3 cursor-move 
               font-semibold text-lg select-none`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{ opacity: isDragging ? 0.5 : 1 }}
    draggable
    onDragStart={onDragStart}
    {...props}
  >
    {word}
  </motion.div>
);

const WordTileGame = ({ onBackToGames }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Create unique word tiles with IDs
  const createWordTiles = useCallback((sentence) => {
    return sentence.jumbled.map((word, index) => ({
      id: `${word}-${index}`,
      word,
      originalIndex: index
    }));
  }, []);

  const [wordTiles, setWordTiles] = useState(() => createWordTiles(sentences[0]));
  const [draggedTileId, setDraggedTileId] = useState(null);
  const [droppedTiles, setDroppedTiles] = useState([]);
  const dropZoneRef = useRef(null);

  // Current sentence for easier access
  const currentSentence = useMemo(() =>
    sentences[currentSentenceIndex],
    [currentSentenceIndex]
  );

  const loadNewSentence = useCallback((index) => {
    setCurrentSentenceIndex(index);
    setWordTiles(createWordTiles(sentences[index]));
    setDroppedTiles([]);
    setDraggedTileId(null);
    setIsCorrect(null);
  }, [createWordTiles]);

  const handleNextSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      loadNewSentence(currentSentenceIndex + 1);
    } else {
      setGameComplete(true);
    }
  }, [currentSentenceIndex, loadNewSentence]);

  const checkAnswer = useCallback((tiles) => {
    const words = tiles.map(tile => tile.word);
    const isAnswerCorrect = gameUtils.isSentenceCorrect(words, currentSentence.correct);
    setIsCorrect(isAnswerCorrect);
  }, [currentSentence.correct]);

  const getWordType = (word) => {
    for (const chunk of currentSentence.chunks) {
      if (chunk.words.includes(word)) {
        return chunk.type;
      }
    }
    return null;
  };

  const getWordClasses = (word) => {
    const type = getWordType(word);
    let classes = [];

    switch (type) {
      case 'N': classes.push('bg-blue-500 text-white'); break;
      case 'V': classes.push('bg-red-500 text-white'); break;
      case 'P': classes.push('bg-green-500 text-white'); break;
      case 'A': classes.push('bg-orange-500 text-white'); break;
      default: classes.push('bg-gray-500 text-white');
    }

    return classes.join(' ');
  };

  const handleDragStart = (tileId) => {
    setDraggedTileId(tileId);
  };

  const findTileById = useCallback((id) => {
    return wordTiles.find(tile => tile.id === id) ||
           droppedTiles.find(tile => tile.id === id);
  }, [wordTiles, droppedTiles]);

  const [dropIndicatorPosition, setDropIndicatorPosition] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;

    const droppedTilesContainer = dropZone.querySelector('.relative.z-10');
    const tiles = Array.from(droppedTilesContainer.children);
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let newPosition = x;
    for (let i = 0; i < tiles.length; i++) {
      const tileRect = tiles[i].getBoundingClientRect();
      if (e.clientX < tileRect.left + tileRect.width / 2) {
        newPosition = tileRect.left - rect.left;
        break;
      } else if (i === tiles.length - 1) {
        newPosition = tileRect.right - rect.left;
      }
    }

    setDropIndicatorPosition(newPosition);
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropIndicatorPosition(null);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedTileId === null) return;

    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;

    const draggedTile = findTileById(draggedTileId);
    if (!draggedTile) return;

    const newDroppedTiles = [...droppedTiles];
    const currentIndex = droppedTiles.findIndex(tile => tile.id === draggedTileId);
    
    const droppedTilesContainer = dropZone.querySelector('.relative.z-10');
    const tiles = Array.from(droppedTilesContainer.children);
    let insertIndex = droppedTiles.length;

    for (let i = 0; i < tiles.length; i++) {
      const tileRect = tiles[i].getBoundingClientRect();
      if (e.clientX < tileRect.left + tileRect.width / 2) {
        insertIndex = i;
        break;
      }
    }

    if (currentIndex !== -1) {
      newDroppedTiles.splice(currentIndex, 1);
      if (insertIndex > currentIndex) {
        insertIndex--;
      }
    } else {
      setWordTiles(wordTiles.filter(tile => tile.id !== draggedTileId));
    }

    newDroppedTiles.splice(insertIndex, 0, draggedTile);
    setDroppedTiles(newDroppedTiles);
    setDropIndicatorPosition(null);

    // Check answer when all words are placed
    if (newDroppedTiles.length === currentSentence.correct.length) {
      setTimeout(() => {
        checkAnswer(newDroppedTiles);
      }, 100);
    } else {
      setIsCorrect(null);
    }
  };

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold mb-8"
        >
          🎉 Congratulations! 🎉
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl mb-8 text-center"
        >
          You've completed all the sentences!
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToGames}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold shadow-lg
                   hover:bg-purple-100 transition-colors duration-200"
        >
          Back to Games
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBackToGames}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          ← Back to Games
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600">Word Tile Game</h2>
          <div className="text-sm text-gray-600 mt-1">
            Sentence {currentSentenceIndex + 1} of {sentences.length}
          </div>
          <div className="mt-2 text-sm">
            <span className="inline-block px-2 py-1 mr-2 bg-blue-500 text-white rounded">Noun</span>
            <span className="inline-block px-2 py-1 mr-2 bg-red-500 text-white rounded">Verb</span>
            <span className="inline-block px-2 py-1 bg-green-500 text-white rounded">Preposition</span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Drag words to form a correct sentence. Colors show parts of speech.
          </div>
        </div>
      </div>

      {/* Word Tiles Container */}
      <div className="mb-12 flex flex-wrap gap-4 justify-center">
        {wordTiles.map((tile) => (
          <WordTile
            key={tile.id}
            word={tile.word}
            className={getWordClasses(tile.word)}
            isDragging={draggedTileId === tile.id}
            onDragStart={() => handleDragStart(tile.id)}
          />
        ))}
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className="drop-zone relative min-h-[100px] border-4 border-dashed border-blue-400
                   rounded-lg overflow-hidden transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative z-10 p-4 flex flex-wrap gap-4 justify-start items-center min-h-[60px]">
          {dropIndicatorPosition !== null && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-400 transform -translate-y-2"
              style={{ left: `${dropIndicatorPosition}px` }}
            />
          )}
          {droppedTiles.map((tile) => (
            <WordTile
              key={tile.id}
              word={tile.word}
              className={getWordClasses(tile.word)}
              isDragging={draggedTileId === tile.id}
              onDragStart={() => handleDragStart(tile.id)}
            />
          ))}
        </div>
      </div>

      {/* Feedback and Next Button */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {isCorrect !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
          >
            {isCorrect ? '✓ Correct!' : '✗ Try again!'}
          </motion.div>
        )}
        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center"
          >
            Correct answer: {currentSentence.correct.join(' ')}
          </motion.div>
        )}
        <button
          onClick={handleNextSentence}
          disabled={droppedTiles.length !== currentSentence.correct.length}
          className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-colors duration-200
                    ${droppedTiles.length === currentSentence.correct.length
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Next Sentence →
        </button>
      </div>
    </div>
  );
};

export default WordTileGame;