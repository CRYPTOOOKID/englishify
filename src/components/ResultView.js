import React from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const ResultView = ({ score, totalQuestions, topic, onBackToTopics }) => {
  const percentage = (score / totalQuestions) * 100;
  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  return (
    <div className="min-h-screen bg-background relative">
      {totalQuestions === 10 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      <div className="max-w-2xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Quiz Complete!</h2>
          <p className="text-text-secondary mb-6">{topic}</p>
          
          <div className="relative mb-8">
            <div className="text-6xl font-bold text-primary">
              {score}
              <span className="text-text-secondary text-3xl">/{totalQuestions}</span>
            </div>
            <p className="text-xl text-text-secondary mt-2">{getFeedback()}</p>
          </div>

          <div className="space-y-4">
            <div className="progress-bar h-4">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-text-secondary">{percentage}% Correct</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToTopics}
            className="btn btn-primary mt-8"
          >
            Try Another Topic
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultView;