import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

// Score Animation Component
const ScoreAnimation = ({ score, position }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: -50,
      scale: [0.5, 1.2, 1, 0.8]
    }}
    transition={{
      duration: 0.8,
      times: [0, 0.2, 0.8, 1],
      ease: "easeOut"
    }}
    className={`fixed ${
      score > 0 ? 'text-green-600' : 'text-red-600'
    } font-bold text-2xl z-[9999] pointer-events-none`}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}
  >
    {score > 0 ? '+1' : '-1'}
  </motion.div>
);

const ResultScreen = ({ finalScore, totalQuestions, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      
      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
        Game Complete!
      </h2>
      
      <div className="text-6xl font-bold text-purple-600 mb-4">
        {finalScore}
        <span className="text-3xl text-gray-600">/{totalQuestions}</span>
      </div>

      <button
        onClick={onRetry}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
          transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Try Again
      </button>
    </motion.div>
  );
};

const WordDropChallenge = ({ onBackToGames }) => {
  const [score, setScore] = useState(0);
  const [lastCheckedScore, setLastCheckedScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [showingSolution, setShowingSolution] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  
  const [words, setWords] = useState([
    { id: 1, text: 'hardware', isUsed: false },
    { id: 2, text: 'display', isUsed: false },
    { id: 3, text: 'folder', isUsed: false },
    { id: 4, text: 'CD ROMs', isUsed: false },
    { id: 5, text: 'button', isUsed: false },
    { id: 6, text: 'access', isUsed: false },
    { id: 7, text: 'break down', isUsed: false },
  ]);

  const [sentences, setSentences] = useState([
    {
      id: 1,
      text: "The computer's <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> includes a keyboard, monitor, and mouse.",
      answer: 'hardware',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 2,
      text: "Did you see the <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> to the email?",
      answer: 'display',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 3,
      text: "Check the settings of your <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> if the text is too small.",
      answer: 'display',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 4,
      text: "In our company, we organize our files in a shared <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> so everyone can access them.",
      answer: 'folder',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 5,
      text: "Some devices only have one <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> for all the functions.",
      answer: 'button',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 6,
      text: "His stereo system may have one <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> because it is so old. It even plays them.",
      answer: 'CD ROMs',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
    {
      id: 7,
      text: "It's important to monitor who has <span class='droppable'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> to your personal information, especially in the digital world.",
      answer: 'access',
      droppedWord: null,
      isCorrect: null,
      isActive: true
    },
  ]);

  const showFeedbackMessage = (message, type) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleDragStart = (event, word) => {
    if (!word.isUsed) {
      event.dataTransfer.setData("word", word.text);
      event.dataTransfer.setData("wordId", word.id.toString());
      event.target.classList.add('dragging');
    }
  };

  const handleDragEnd = (event) => {
    event.target.classList.remove('dragging');
  };

  const handleDrop = (event, sentenceId) => {
    event.preventDefault();
    const word = event.dataTransfer.getData("word");
    const wordId = parseInt(event.dataTransfer.getData("wordId"));

    const sentenceIndex = sentences.findIndex(s => s.id === sentenceId);
    if (sentenceIndex !== -1) {
      const updatedSentences = [...sentences];
      const updatedWords = [...words];
      const currentSentence = updatedSentences[sentenceIndex];

      // If there was a previous word in this sentence, make it available again
      if (currentSentence.droppedWord) {
        const oldWordId = updatedWords.findIndex(w => w.text === currentSentence.droppedWord);
        if (oldWordId !== -1) {
          updatedWords[oldWordId].isUsed = false;
        }
      }

      // Update the sentence with the new word
      currentSentence.droppedWord = word;
      currentSentence.isCorrect = null; // Reset correctness until check button is clicked
      updatedWords.find(w => w.id === wordId).isUsed = true;
      
      setSentences(updatedSentences);
      setWords(updatedWords);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleRetry = () => {
    // Reset all sentences and words
    const resetSentences = sentences.map(sentence => ({
      ...sentence,
      droppedWord: null,
      isCorrect: null
    }));
    
    const resetWords = words.map(word => ({
      ...word,
      isUsed: false
    }));
    
    setSentences(resetSentences);
    setWords(resetWords);
    setScore(0);
    setLastCheckedScore(0);
    setScoreAnimations([]);
    setShowingSolution(false);
    setShowFinalScore(false);
  };

  const handleShowSolution = () => {
    const solvedSentences = sentences.map(sentence => ({
      ...sentence,
      droppedWord: sentence.answer,
      isCorrect: true
    }));
    
    const usedWords = words.map(word => ({
      ...word,
      isUsed: sentences.some(s => s.answer === word.text)
    }));
    
    setSentences(solvedSentences);
    setWords(usedWords);
    setShowingSolution(true);
  };

  const handleFinishGame = () => {
    setScore(lastCheckedScore);
    setShowFinalScore(true);
  };

  const handleCheck = () => {
    const updatedSentences = sentences.map(sentence => ({
      ...sentence,
      isCorrect: sentence.droppedWord === sentence.answer
    }));

    // Clear any existing animations
    setScoreAnimations([]);

    // Create new animations for each answered sentence
    const newAnimations = [];
    updatedSentences.forEach((sentence, index) => {
      if (sentence.droppedWord) {
        const element = document.querySelector(`[data-sentence-id="${sentence.id}"] .droppable-area`);
        if (element) {
          const rect = element.getBoundingClientRect();
          newAnimations.push({
            id: Date.now() + index,
            score: sentence.isCorrect ? 1 : -1,
            position: {
              x: rect.left + (rect.width / 2) - 10,
              y: rect.top - 10
            }
          });
        }
      }
    });

    setScoreAnimations(newAnimations);

    // Remove animations after they complete
    setTimeout(() => {
      setScoreAnimations([]);
    }, 1000);

    setSentences(updatedSentences);
    
    // Calculate and save score
    const checkedScore = updatedSentences.reduce((acc, sentence) => {
      if (sentence.isCorrect === true) return acc + 1;
      if (sentence.isCorrect === false) return acc - 1;
      return acc;
    }, 0);
    
    setScore(checkedScore);
    setLastCheckedScore(checkedScore);
    
    if (checkedScore === sentences.length) {
      showFeedbackMessage('Perfect score! 🎉', 'success');
    } else {
      showFeedbackMessage('Check your answers and try again! 💪', 'error');
    }
  };

  if (showFinalScore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
          <ResultScreen
            finalScore={score}
            totalQuestions={sentences.length}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full"
      >
        <div className="flex items-center mb-8">
          <button
            onClick={onBackToGames}
            className="btn btn-outline mr-8"
          >
            ← Back to Games
          </button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Word Drop Challenge
            </h2>
            <p className="text-gray-600 mt-2">
              Place the words in the correct sentences and check your answers!
            </p>
          </div>
        </div>

        {/* Score Animations */}
        <AnimatePresence>
          {scoreAnimations.map(animation => (
            <ScoreAnimation
              key={animation.id}
              score={animation.score}
              position={animation.position}
            />
          ))}
        </AnimatePresence>

        {/* Word Bank */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Word Bank</h3>
          <motion.div
            className="flex flex-wrap gap-3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {words.map(word => (
              <motion.button
                key={word.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className={`${
                  word.isUsed
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:bg-purple-50 text-purple-800 shadow-sm hover:shadow-md'
                } font-medium py-2 px-4 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200`}
                draggable={!word.isUsed}
                onDragStart={(event) => handleDragStart(event, word)}
                onDragEnd={handleDragEnd}
              >
                {word.text}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-lg text-center font-medium ${
                feedbackType === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 mb-8">
          {sentences.map(sentence => (
            <motion.div
              key={sentence.id}
              data-sentence-id={sentence.id}
              initial={false}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg transition-colors duration-200 ${
                sentence.isCorrect === true
                  ? 'bg-green-50 border-2 border-green-200'
                  : sentence.isCorrect === false
                    ? 'bg-red-50 border-2 border-red-200'
                    : 'bg-white border-2 border-purple-200 shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="text-lg flex-grow"
                  onDrop={(event) => handleDrop(event, sentence.id)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  dangerouslySetInnerHTML={{
                    __html: sentence.text.replace(
                      '<span class=\'droppable\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',
                      `<span class='${
                        sentence.isCorrect === true
                          ? 'bg-green-200 text-green-800'
                          : sentence.isCorrect === false
                            ? 'bg-red-200 text-red-800'
                            : 'bg-purple-100 text-purple-800'
                      } px-4 py-1 rounded-md inline-block min-w-[100px] text-center droppable-area'>${
                        sentence.droppedWord || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                      }</span>`
                    ),
                  }}
                />
                {sentence.isCorrect !== null && (
                  <span className="text-xl">
                    {sentence.isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {showingSolution ? (
            <button
              onClick={handleFinishGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Finish Game
            </button>
          ) : (
            <>
              <button
                onClick={handleCheck}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Check Answers
              </button>
              <button
                onClick={handleRetry}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-sm hover:shadow-md border border-gray-200"
              >
                Retry
              </button>
              <button
                onClick={handleShowSolution}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-sm hover:shadow-md border border-indigo-200"
              >
                Show Solution
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WordDropChallenge;