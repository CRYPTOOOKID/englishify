import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const questions = [
  {
    id: 1,
    text: "I like pizza ______ I don't like mushrooms.",
    choices: ["but", "because", "when", "then"],
    answer: "but"
  },
  {
    id: 2,
    text: "______ it rains, we will stay inside.",
    choices: ["If", "and", "or", "yet"],
    answer: "If"
  },
  {
    id: 3,
    text: "She studied hard ______ she passed the test.",
    choices: ["so", "although", "while", "unless"],
    answer: "so"
  },
  {
    id: 4,
    text: "We went to the park ______ played on the swings.",
    choices: ["and", "because", "before", "yet"],
    answer: "and"
  },
  {
    id: 5,
    text: "______ I finish my homework, I can watch TV.",
    choices: ["After", "But", "So", "Unless"],
    answer: "After"
  },
  {
    id: 6,
    text: "He was tired ______ he went to bed early.",
    choices: ["because", "or", "and", "unless"],
    answer: "because"
  },
  {
    id: 7,
    text: "I want to go swimming ______ the pool is closed.",
    choices: ["but", "when", "if", "therefore"],
    answer: "but"
  },
  {
    id: 8,
    text: "______ the bell rings, it's time for lunch.",
    choices: ["When", "So", "And", "Unless"],
    answer: "When"
  },
  {
    id: 9,
    text: "We can eat pizza ______ we can eat hamburgers.",
    choices: ["or", "because", "although", "hence"],
    answer: "or"
  },
  {
    id: 10,
    text: "______ she was sick, she went to school.",
    choices: ["Although", "So", "And", "Hence"],
    answer: "Although"
  },
  {
    id: 11,
    text: "I ate a sandwich, ______ I was still hungry.",
    choices: ["yet", "when", "after", "since"],
    answer: "yet"
  },
  {
    id: 12,
    text: "______ you finish your vegetables you may have dessert.",
    choices: ["If", "so", "but", "hence"],
    answer: "If"
  },
  {
    id: 13,
    text: "The sun was shining brightly, ______ the wind was cold.",
    choices: ["yet", "when", "because", "therefore"],
    answer: "yet"
  },
  {
    id: 14,
    text: "______ he practice he will improve.",
    choices: ["If", "but", "or", "hence"],
    answer: "If"
  },
  {
    id: 15,
    text: "I read a book ______ I went to bed.",
    choices: ["and", "when", "If", "hence"],
    answer: "and"
  }
];

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

const ResultScreen = ({ score, totalQuestions, onRetry }) => {
  const percentage = Math.round(((score / totalQuestions) * 100) * 10) / 10;
  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

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
        {score}
        <span className="text-3xl text-gray-600">/{totalQuestions}</span>
      </div>

      <p className="text-xl text-gray-600 mb-6">{getFeedback()}</p>

      <div className="space-y-4 mb-8">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-gray-600">{percentage}% Correct</p>
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

const Dragzilla = ({ onBackToGames }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleDragStart = (event, choice) => {
    event.dataTransfer.setData("choice", choice);
    event.dataTransfer.effectAllowed = "move";
    
    // Set drag preview text with scale animation
    event.target.style.transform = 'scale(1.05)';
    event.target.style.opacity = "0.6";
    event.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Add dragging class to body for global cursor change
    document.body.classList.add('dragging');
    setIsDragging(true);
  };

  const handleDragEnd = (event) => {
    // Reset styles with transition
    event.target.style.transition = 'all 0.2s ease-out';
    event.target.style.transform = 'scale(1)';
    event.target.style.opacity = "1";
    event.target.style.boxShadow = 'none';

    // Clean up after transition
    setTimeout(() => {
      event.target.style.transition = '';
    }, 200);
    
    document.body.classList.remove('dragging');
    setIsDragging(false);
    
    // Remove dragover class from all drop zones with fade
    document.querySelectorAll('.droppable-area').forEach(zone => {
      zone.style.transition = 'all 0.2s ease-out';
      zone.classList.remove('dragover');
    });
  };

  const handleDrop = (event) => {
    if (hasAnswered) return;
    
    event.preventDefault();
    const choice = event.dataTransfer.getData("choice");
    const newAnswers = { ...answers };
    newAnswers[currentQuestionIndex] = choice;
    setAnswers(newAnswers);
    checkAnswer(choice);
    
    // Remove dragover class
    event.currentTarget.classList.remove('dragover');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    
    // Only add dragover class if we haven't answered yet
    if (!hasAnswered) {
      event.currentTarget.classList.add('dragover');
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const checkAnswer = (choice) => {
    const isCorrect = choice === currentQuestion.answer;
    setHasAnswered(true);
    
    // Create score animation
    const dropArea = document.querySelector('.droppable-area');
    if (dropArea) {
      const rect = dropArea.getBoundingClientRect();
      setScoreAnimations([{
        id: Date.now(),
        score: isCorrect ? 1 : -1,
        position: {
          x: rect.left + (rect.width / 2) - 10,
          y: rect.top - 10
        }
      }]);

      // Clear animation after it completes
      setTimeout(() => setScoreAnimations([]), 1000);
    }

    // Update score and show feedback
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedbackMessage('Correct! 🎉');
    } else {
      setFeedbackMessage(`Incorrect! The correct answer is "${currentQuestion.answer}"`);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setHasAnswered(false);
      setShowFeedback(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setHasAnswered(false);
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setScoreAnimations([]);
    setShowResults(false);
    setHasAnswered(false);
    setShowFeedback(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
        <button
          onClick={onBackToGames}
          className="absolute top-8 left-8 btn btn-outline"
        >
          ← Back to Games
        </button>
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full">
          <ResultScreen
            score={score}
            totalQuestions={questions.length}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <button
        onClick={onBackToGames}
        className="absolute top-8 left-8 btn btn-outline"
      >
        ← Back to Games
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dragzilla
            </h2>
            <p className="text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <span className="font-bold text-purple-600">{score}</span>
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

        {/* Feedback Message */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-lg text-center font-medium ${
                feedbackMessage.includes('Correct')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question */}
        <div className="bg-white border-2 border-purple-200 shadow-md rounded-lg p-6 mb-8">
          <div 
            className="text-lg flex items-center justify-center min-h-[100px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {currentQuestion.text.split(/_{2,}/).map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className={`${
                    answers[currentQuestionIndex] 
                      ? (answers[currentQuestionIndex] === currentQuestion.answer 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800')
                      : 'bg-purple-100 text-purple-800'
                  } px-4 py-1 rounded-md inline-block min-w-[100px] text-center mx-2 droppable-area
                  transition-all duration-200 ease-out border-2
                  ${!hasAnswered ? 'border-dashed border-purple-300 hover:border-purple-400 hover:bg-purple-50' : 'border-transparent'}
                  ${isDragging && !hasAnswered ? 'shadow-lg border-purple-400 bg-purple-50' : ''}`}>
                    {answers[currentQuestionIndex] || '______'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Conjunction Choices */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {currentQuestion.choices.map((choice, index) => (
              <motion.button
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className={`${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } ${hasAnswered ? 'opacity-50 cursor-not-allowed' : ''}
                bg-white text-purple-800 shadow-sm
                font-medium py-3 px-6 rounded-lg
                transition-all duration-200 ease-out transform
                border-2 border-transparent
                ${!hasAnswered ? 'hover:bg-purple-50 hover:shadow-md hover:-translate-y-0.5 hover:border-purple-200 active:translate-y-0' : ''}`}
                draggable={!hasAnswered}
                onDragStart={(e) => handleDragStart(e, choice)}
                onDragEnd={handleDragEnd}
              >
                {choice}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`${
                currentQuestionIndex === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              } bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-sm hover:shadow-md`}
            >
              ← Previous
            </button>
            {hasAnswered && (
              <button
                onClick={handleNextQuestion}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg
                  transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Game" : "Next Question →"}
              </button>
            )}
            <button
              onClick={handleRetry}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-6 rounded-lg
                transition-colors duration-200 shadow-sm hover:shadow-md border border-indigo-200"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dragzilla;