import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import ProgressTracker from './ProgressTracker';

const QuestionView = ({
  question,
  onNext,
  onPrevious,
  onAnswerSubmit,
  answers,
  currentQuestionIndex,
  totalQuestions
}) => {
  const [answerFeedback, setAnswerFeedback] = useState({
    show: false,
    selectedIndex: null,
    correctIndex: null,
    isCorrect: false
  });
  const [textAnswer, setTextAnswer] = useState('');
  const [showProTip, setShowProTip] = useState(false);

  useEffect(() => {
    setAnswerFeedback({
      show: false,
      selectedIndex: null,
      correctIndex: null,
      isCorrect: false
    });
    setTextAnswer('');
    setShowProTip(false);
  }, [question?.questionId]);

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-secondary text-lg">No questions found for this topic.</p>
      </div>
    );
  }

  const handleOptionClick = (index) => {
    const correctAnswerIndex = Number(question.correct_answer);
    const isCorrect = index === correctAnswerIndex;
    setAnswerFeedback({
      show: true,
      selectedIndex: index,
      correctIndex: correctAnswerIndex,
      isCorrect
    });
    setShowProTip(true);
    onAnswerSubmit(isCorrect);
  };

  const handleTextSubmit = () => {
    if (question.type !== 'fill_in_the_blank') {
      const correctAnswerIndex = Number(question.correct_answer);
      const isCorrect = false;
      setAnswerFeedback({
        show: true,
        isCorrect,
        selectedIndex: null,
        correctIndex: correctAnswerIndex
      });
      setShowProTip(true);
      onAnswerSubmit(isCorrect);
      return;
    }
    
    const submittedAnswer = textAnswer.trim().toLowerCase();
    let correctAnswer = '';
    if (typeof question.correct_answer === 'string') {
      correctAnswer = question.correct_answer.toLowerCase();
    } else if (question.correct_answer && question.correct_answer.S) {
      correctAnswer = question.correct_answer.S.toLowerCase();
    }
    
    const isCorrect = submittedAnswer === correctAnswer;
    setAnswerFeedback({
      show: true,
      isCorrect,
      selectedIndex: null,
      correctIndex: null
    });
    setShowProTip(true);
    onAnswerSubmit(isCorrect);
  };

  const handleTextChange = (e) => {
    setTextAnswer(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !answerFeedback.show) {
      handleTextSubmit();
    }
  };

  const handleNextQuestion = () => {
    if (onNext) {
      setAnswerFeedback({
        show: false,
        selectedIndex: null,
        correctIndex: null
      });
      setShowProTip(false);
      onNext();
    }
  };

  const handlePreviousQuestion = () => {
    if (onPrevious) {
      setAnswerFeedback({
        show: false,
        selectedIndex: null,
        correctIndex: null
      });
      setShowProTip(false);
      onPrevious();
    }
  };

  const getOptionContent = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (typeof option === 'object' && option !== null) {
      return option.S || JSON.stringify(option);
    }
    if (option === undefined || option === null || Number.isNaN(option)) {
      return '';
    }
    return String(option);
  };

  const isLastQuestion = question.questionId === question.totalQuestions;
  
  // Debug the protip
  console.log('Question Object:', question);
  console.log('Show ProTip:', showProTip);
  console.log('ProTip Content:', question.pro_tip);

  const getOptionClassName = (index) => {
    const baseClasses = "group relative bg-white p-6 rounded-lg " +
      "transition-all duration-200 ease-out w-full text-left " +
      "border shadow-sm hover:shadow-md ";

    if (!answerFeedback.show) {
      return baseClasses +
        "border-gray-100 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 " +
        "hover:shadow-purple-100/50";
    }

    if (index === answerFeedback.correctIndex) {
      return baseClasses +
        "border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/80 " +
        "shadow-green-100/50";
    }

    if (index === answerFeedback.selectedIndex && index !== answerFeedback.correctIndex) {
      return baseClasses +
        "border-red-200 bg-gradient-to-br from-red-50/80 to-rose-50/80 " +
        "shadow-red-100/50";
    }

    return baseClasses +
      "border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed " +
      "shadow-none";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white p-8"
    >
      <div className="max-w-4xl mx-auto relative">
        <ProgressTracker
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          answers={answers}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Question Card */}
          <div className="p-8">
            {/* Question Text */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-semibold text-gray-800 mb-8"
            >
              {question.question}
            </motion.h2>

            {/* Options or Text Input */}
            <motion.div
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
              className="space-y-4"
            >
              {question.type === 'fill_in_the_blank' ? (
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={handleTextChange}
                    onKeyPress={handleKeyPress}
                    disabled={answerFeedback.show}
                    placeholder="Type your answer..."
                    className="flex-1 p-4 rounded-lg border border-gray-200 focus:border-purple-400 
                      focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  />
                  {!answerFeedback.show && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTextSubmit}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 
                        rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Submit
                    </motion.button>
                  )}
                  {answerFeedback.show && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                      <span className={`text-2xl ${answerFeedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {answerFeedback.isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-sm text-gray-600">
                        Correct answer: {getOptionContent(question.correct_answer)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      onClick={() => handleOptionClick(index)}
                      disabled={answerFeedback.show && index !== answerFeedback.selectedIndex && index !== answerFeedback.correctIndex}
                      className={getOptionClassName(index)}
                      whileHover={!answerFeedback.show ? { y: -2, scale: 1.01 } : {}}
                      whileTap={!answerFeedback.show ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`relative z-10 text-lg font-medium transition-colors duration-150 ease-out
                          ${!answerFeedback.show ? 'text-gray-700 group-hover:text-indigo-700' :
                            index === answerFeedback.correctIndex ? 'text-green-700' :
                            index === answerFeedback.selectedIndex ? 'text-red-700' :
                            'text-gray-500'}`}>
                          {getOptionContent(option)}
                        </span>
                        {answerFeedback.show && (index === answerFeedback.correctIndex || index === answerFeedback.selectedIndex) && (
                          <span className="relative z-10">
                            {index === answerFeedback.correctIndex ? (
                              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Pro Tip */}
            {showProTip && question.pro_tip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-gradient-to-br from-indigo-100 to-blue-100">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Pro Tip</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{question.pro_tip}</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePreviousQuestion}
                disabled={!onPrevious}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 
                  hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all duration-200"
              >
                ← Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                disabled={!isLastQuestion && !onNext}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${isLastQuestion 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
                  }`}
              >
                {isLastQuestion ? "Finish Quiz" : "Next →"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuestionView;
