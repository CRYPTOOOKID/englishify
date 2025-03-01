import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

// IELTS Writing Task Questions
const writingQuestions = [
  {
    id: 1,
    text: "The chart below shows the number of trips made by children in one country in 1990 and 2010 to travel to and from school using different modes of transport.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant."
  },
  {
    id: 2,
    text: "Write about the following topic:\n\nThe average standard of people's health is likely to be lower in the future than it is now.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience."
  }
];

const WritingPage = ({ onBackToStart }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Calculate word count
  const calculateWordCount = (text) => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // Update word count when user answer changes
  useEffect(() => {
    setWordCount(calculateWordCount(userAnswer));
  }, [userAnswer]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Show review button when on the second question and submitted
    if (currentQuestionIndex === 1) {
      setShowReviewButton(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < writingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setIsSubmitted(false);
    }
  };

  const handleReviewScore = () => {
    // This would navigate to a review/scoring page
    console.log("Review score clicked");
    // Implementation for review functionality would go here
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pt-12 pb-12 px-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={onBackToStart}
            >
              ← Back to IELTS
            </Button>
            
            <motion.p
              className="text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Question {currentQuestionIndex + 1} of {writingQuestions.length}
            </motion.p>
          </div>
          
          <motion.h1
            className="text-3xl font-bold text-slate-800 mb-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IELTS Writing Task
          </motion.h1>
        </div>

        {/* Main content - Two bigger boxes side by side with maximum width */}
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-8 w-full mx-auto">
          {/* Question Box - Left side */}
          <motion.div
            className="w-full lg:w-[49.5%]"
            variants={cardVariants}
            initial="initial"
            animate="animate"
          >
            <Card className="h-full border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-12 pb-12 px-6">
                <h2 className="text-3xl font-semibold text-slate-700 mb-6">Question:</h2>
                <div
                  className="bg-slate-50 rounded-lg p-6 overflow-auto"
                  style={{ height: '650px', minHeight: '650px' }}
                >
                  <p className="font-medium text-2xl italic text-slate-800 whitespace-pre-line" style={{ fontSize: 'calc(1.25rem * 1.1)' }}>
                    {writingQuestions[currentQuestionIndex].text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Box - Right side */}
          <motion.div
            className="w-full lg:w-[49.5%]"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-slate-200 bg-white shadow-lg">
              <CardContent className="pt-12 pb-12 px-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-semibold text-slate-700">Your Answer:</h2>
                  <div className="bg-white px-4 py-1 rounded-md shadow-sm" style={{ minWidth: '180px' }}>
                    <p className="text-slate-700 font-bold italic text-right">
                      Word count: {wordCount}
                    </p>
                  </div>
                </div>
                <textarea
                  id="essay-textarea"
                  className="w-full p-6 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-xl"
                  placeholder="Write your essay here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  style={{
                    height: '650px',
                    minHeight: '650px',
                    textAlign: 'left',
                    direction: 'ltr',
                    fontSize: 'calc(1.25rem * 1.2)'
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div 
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="default"
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "border-teal-600 text-teal-600 hover:bg-teal-50",
              !isSubmitted && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleNext}
            disabled={!isSubmitted}
          >
            Next Question
          </Button>

          {showReviewButton && (
            <Button
              variant="secondary"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleReviewScore}
            >
              Review Score
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WritingPage;