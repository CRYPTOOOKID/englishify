import React from 'react';

const ProgressTracker = ({ currentQuestion, totalQuestions, answers }) => {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
      {[...Array(totalQuestions)].map((_, index) => {
        const questionNumber = index + 1;
        const isCurrentQuestion = questionNumber === currentQuestion;
        const answer = answers[index];
        
        let circleClasses = "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300";
        
        if (isCurrentQuestion) {
          circleClasses += " bg-blue-500 text-white";
        } else if (answer === undefined) {
          circleClasses += " border-2 border-gray-300 bg-white text-gray-600";
        } else if (answer) {
          circleClasses += " bg-green-500 text-white";
        } else {
          circleClasses += " bg-red-500 text-white";
        }

        return (
          <div key={index} className="relative group">
            <div className={circleClasses}>
              {answer === undefined ? (
                questionNumber
              ) : answer ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Question {questionNumber}
              {answer !== undefined && (
                <span className="ml-1">
                  ({answer ? 'Correct' : 'Incorrect'})
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;