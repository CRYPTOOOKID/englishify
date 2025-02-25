import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressTracker = ({ currentQuestion, totalQuestions, answers }) => {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50">
      {/* Progress panel header */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-blue-100 mb-1">
        <h3 className="text-sm font-semibold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Progress
        </h3>
      </div>
      
      {/* Question indicators */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-blue-100 flex flex-col gap-3">
        {[...Array(totalQuestions)].map((_, index) => {
          const questionNumber = index + 1;
          const isCurrentQuestion = questionNumber === currentQuestion;
          const answer = answers[index];
          
          // Determine styling
          let bgColor = "bg-slate-100";
          let textColor = "text-slate-500";
          let borderColor = "border-slate-200";
          let icon = null;
          
          if (isCurrentQuestion) {
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
            borderColor = "border-blue-300";
            icon = (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            );
          } else if (answer === true) {
            bgColor = "bg-emerald-50";
            textColor = "text-emerald-700";
            borderColor = "border-emerald-200";
            icon = (
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            );
          } else if (answer === false) {
            bgColor = "bg-amber-50";
            textColor = "text-amber-700";
            borderColor = "border-amber-200";
            icon = (
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            );
          } else {
            icon = (
              <span className="w-4 h-4 flex items-center justify-center text-xs font-medium text-slate-500">
                {questionNumber}
              </span>
            );
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative group flex items-center p-2 rounded-lg border ${borderColor} ${bgColor} transition-all duration-300`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${textColor}`}>
                    {icon}
                  </div>
                  <span className={`text-sm font-medium ${textColor}`}>Q{questionNumber}</span>
                </div>
                
                <AnimatePresence>
                  {answer !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        answer ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {answer ? 'Correct' : 'Incorrect'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Expanded tooltip on hover */}
              <div className="absolute left-0 right-0 -bottom-1 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-white p-3 rounded-lg shadow-lg border border-blue-100 mt-2 text-xs">
                  <div className="font-medium text-slate-800">Question {questionNumber}</div>
                  {answer !== undefined ? (
                    <div className={`mt-1 ${answer ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {answer ? 'Correctly answered' : 'Incorrectly answered'}
                    </div>
                  ) : (
                    <div className="mt-1 text-slate-500">
                      {isCurrentQuestion ? 'Current question' : 'Not answered yet'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;