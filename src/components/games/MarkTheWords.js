import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MarkTheWords = ({ onBackToGames }) => {
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const paragraph = `Read the sentences, then select all the words that are used to show examples.
I love to eat fruits, such as apples, bananas, and oranges.
There are many different types of dogs, including poodles, bulldogs, and beagles.
She has many hobbies, like painting, playing the guitar, and reading.
We offer a variety of services, among others, cleaning, repairs, and maintenance.
Jane's health is very important to her. To illustrate, she exercises every day.
The machine is easy to use. To demonstrate, press the Copy button.
There are many different types of music, e.g., rock, pop, and classical.
The city has many tourist attractions, namely, museums, parks, and monuments.
She's a talented musician, that is to say, she can play several instruments.`;

  // All correct phrases that should be identified
  const correctWords = new Set([
    'such as',
    'including',
    'like',
    'among others',
    'to illustrate',
    'to demonstrate',
    'e.g.',
    'namely',
    'that is to say'
  ]);

  const handleWordClick = (word) => {
    if (!showResults) {
      const newSelectedWords = new Set(selectedWords);
      if (selectedWords.has(word)) {
        newSelectedWords.delete(word);
      } else {
        newSelectedWords.add(word);
      }
      setSelectedWords(newSelectedWords);
    }
  };

  const handleSubmit = () => {
    let points = 0;
    selectedWords.forEach(word => {
      if (correctWords.has(word)) {
        points += 1; // +1 for correct selections
      } else {
        points -= 1; // -1 for incorrect selections
      }
    });
    setScore(points);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedWords(new Set());
    setShowResults(false);
    setShowAnswers(false);
    setScore(0);
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
    setSelectedWords(new Set(correctWords));
  };

  const renderWord = (word) => {
    const isSelected = selectedWords.has(word);
    const isCorrect = correctWords.has(word);
    let className = "inline-block cursor-pointer px-1 py-0.5 rounded-md mx-1 transition-all duration-200";
    
    if (showAnswers) {
      if (isCorrect) {
        className += " bg-green-100 text-green-800";
      }
    } else if (!showResults && isSelected) {
      className += " bg-purple-100 text-purple-800";
    } else if (showResults) {
      if (isSelected && isCorrect) {
        className += " bg-green-100 text-green-800";
      } else if (isSelected && !isCorrect) {
        className += " bg-red-100 text-red-800";
      }
    } else {
      className += " hover:bg-purple-50";
    }

    return (
      <span
        key={word}
        onClick={() => handleWordClick(word)}
        className={className}
      >
        {word}
        {showResults && isSelected && (
          <span className="ml-1">
            {isCorrect ? '✓' : '✗'}
          </span>
        )}
      </span>
    );
  };

  const processText = (text) => {
    const phrases = [
      'that is to say',
      'such as',
      'among others',
      'to illustrate',
      'to demonstrate',
      'including',
      'namely',
      'like',
      'e.g.'
    ];

    let tokens = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
      let matchFound = false;
      
      // Try to match phrases first
      for (const phrase of phrases) {
        if (text.slice(currentIndex).toLowerCase().startsWith(phrase.toLowerCase())) {
          tokens.push({
            text: phrase,
            isPhrase: true,
            start: currentIndex,
            end: currentIndex + phrase.length
          });
          currentIndex += phrase.length;
          matchFound = true;
          break;
        }
      }

      // If no phrase matches, take the next word
      if (!matchFound) {
        const nextSpace = text.indexOf(' ', currentIndex);
        const wordEnd = nextSpace === -1 ? text.length : nextSpace;
        const word = text.slice(currentIndex, wordEnd);
        
        if (word) {
          tokens.push({
            text: word,
            isPhrase: false,
            start: currentIndex,
            end: wordEnd
          });
        }
        currentIndex = wordEnd + 1;
      }

      // Skip any extra spaces
      while (currentIndex < text.length && text[currentIndex] === ' ') {
        currentIndex++;
      }
    }

    return tokens;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Mark the Words
            </h2>
            <p className="text-gray-600 mt-2">
              Find and select all words used to show examples
            </p>
          </div>
          <button
            onClick={onBackToGames}
            className="btn btn-outline"
          >
            ← Back to Games
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6">
          <div className="prose max-w-none">
            {paragraph.split('\n').map((line, index) => (
              <p key={index} className="mb-2">
                {processText(line).map((token, tokenIndex) => (
                  <React.Fragment key={tokenIndex}>
                    {renderWord(token.text)}
                    {' '}
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">
                  Your Score: {score} points
                </p>
                <p className="text-gray-600">
                  {score === correctWords.size ? '🎉 Perfect score!' : 'Keep practicing!'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={showResults ? handleReset : handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              {showResults ? 'Try Again' : 'Show Result'}
            </button>

            {showResults && !showAnswers && (
              <button
                onClick={handleShowAnswers}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Show Answers
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-purple-600">{score}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarkTheWords;