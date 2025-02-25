import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton, SkeletonCircle } from "../components/ui/skeleton";
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
      <div className="flex flex-col gap-6 min-h-[400px] p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
        <div className="w-full max-w-md mx-auto mb-6">
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-5 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm">
            <SkeletonCircle size="12" className="bg-blue-100" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-5" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        ))}
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
    const baseClasses = "group relative p-6 rounded-xl " +
      "transition-all duration-300 ease-out w-full text-left " +
      "border backdrop-blur-sm ";

    if (!answerFeedback.show) {
      return baseClasses +
        "bg-white/90 border-slate-100 hover:border-blue-300 hover:bg-gradient-to-br " +
        "hover:from-blue-50/90 hover:to-indigo-50/90 hover:shadow-lg hover:shadow-blue-100/30 " +
        "transform hover:-translate-y-1";
    }

    if (index === answerFeedback.correctIndex) {
      return baseClasses +
        "border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-teal-50/90 " +
        "shadow-lg shadow-emerald-100/30 transform scale-[1.02]";
    }

    if (index === answerFeedback.selectedIndex && index !== answerFeedback.correctIndex) {
      return baseClasses +
        "border-amber-200 bg-gradient-to-br from-amber-50/90 to-orange-50/90 " +
        "shadow-lg shadow-amber-100/30";
    }

    return baseClasses +
      "border-slate-100 bg-slate-50/30 opacity-50 cursor-not-allowed " +
      "shadow-none";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-200/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <ProgressTracker
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          answers={answers}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          {/* Question Card */}
          <div className="p-8 relative">
            
            {/* Question Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 mb-8 relative"
            >
              <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed pl-4 border-l-4 border-blue-400">
                {question.question}
              </h2>
              <div className="absolute -z-10 top-0 left-0 w-full h-full bg-blue-50/50 rounded-lg transform -rotate-1"></div>
            </motion.div>

            {/* Options or Text Input */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="space-y-5 relative"
            >
              {/* Decorative line connecting options */}
              {question.type !== 'fill_in_the_blank' && (
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-100 via-indigo-100 to-transparent"></div>
              )}
              {question.type === 'fill_in_the_blank' ? (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-100 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row items-stretch gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={textAnswer}
                        onChange={handleTextChange}
                        onKeyPress={handleKeyPress}
                        disabled={answerFeedback.show}
                        placeholder="Type your answer..."
                        className="w-full p-4 rounded-lg border border-blue-200 bg-white/90 focus:border-blue-400
                          focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-inner"
                      />
                      <div className="absolute -bottom-1 -right-1 w-full h-full bg-blue-50 rounded-lg -z-10 transform rotate-1"></div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {!answerFeedback.show ? (
                        <motion.button
                          key="submit-button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleTextSubmit}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4
                            rounded-lg font-medium shadow-md hover:shadow-xl transition-all duration-200
                            flex items-center justify-center min-w-[120px]"
                        >
                          <span>Submit</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </motion.button>
                      ) : (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`flex items-center gap-3 p-4 rounded-lg ${
                            answerFeedback.isCorrect
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
                              : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                          }`}
                        >
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            answerFeedback.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {answerFeedback.isCorrect ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${answerFeedback.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {answerFeedback.isCorrect ? 'Correct!' : 'Not quite right'}
                            </p>
                            <p className="text-sm text-slate-600">
                              Correct answer: <span className="font-medium">{getOptionContent(question.correct_answer)}</span>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <div className="grid gap-5">
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
                      whileHover={!answerFeedback.show ? { y: -3, scale: 1.02 } : {}}
                      whileTap={!answerFeedback.show ? { scale: 0.98 } : {}}
                    >
                      {/* Option letter indicator */}
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                          ${!answerFeedback.show
                            ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:text-blue-700'
                            : index === answerFeedback.correctIndex
                              ? 'bg-emerald-100 text-emerald-600'
                              : index === answerFeedback.selectedIndex
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-slate-400'
                          } transition-colors duration-200`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full pl-6">
                        <span className={`relative z-10 text-lg font-medium transition-colors duration-150 ease-out
                          ${!answerFeedback.show
                            ? 'text-slate-700 group-hover:text-blue-700'
                            : index === answerFeedback.correctIndex
                              ? 'text-emerald-700'
                              : index === answerFeedback.selectedIndex
                                ? 'text-amber-700'
                                : 'text-slate-400'}`}>
                          {getOptionContent(option)}
                        </span>
                        
                        <AnimatePresence>
                          {answerFeedback.show && (index === answerFeedback.correctIndex || index === answerFeedback.selectedIndex) && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full"
                            >
                              {index === answerFeedback.correctIndex ? (
                                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Decorative background element */}
                      {!answerFeedback.show && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50/30
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Pro Tip */}
            <AnimatePresence>
              {showProTip && question.pro_tip && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="mt-10 relative"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-100/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100/30 rounded-full blur-lg"></div>
                  
                  <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="75" cy="25" r="20" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
                        <circle cx="75" cy="75" r="10" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />
                        <circle cx="25" cy="25" r="15" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
                        <circle cx="25" cy="75" r="25" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
                      </svg>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Pro Tip
                        </h3>
                        <p className="text-sm text-slate-500">Enhance your understanding</p>
                      </div>
                    </div>
                    
                    <div className="pl-4 border-l-2 border-blue-300">
                      <p className="text-slate-700 leading-relaxed">{question.pro_tip}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePreviousQuestion}
                disabled={!onPrevious}
                className="px-6 py-3 rounded-xl font-medium text-slate-700 bg-gradient-to-r from-slate-50 to-blue-50
                  border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-md
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:x-0
                  transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                disabled={!isLastQuestion && !onNext}
                className={`px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg
                  transition-all duration-300 flex items-center gap-2
                  ${isLastQuestion
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  }`}
              >
                <span>{isLastQuestion ? "Finish Quiz" : "Next"}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuestionView;
