import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const ResultScreen = ({ score, totalQuestions, onRetry, onBackToStart }) => {
  const percentage = Math.round(((score / totalQuestions) * 100) * 10) / 10;
  
  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full text-center"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Quiz Complete!
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

        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg
              transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          <button
            onClick={onBackToStart}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg
              transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back to Start
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultScreen;