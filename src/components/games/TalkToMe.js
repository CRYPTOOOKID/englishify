import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const questions = [
  "What's your favorite book and why?",
  "Describe your ideal vacation destination.",
  "What's the most interesting thing you learned recently?",
  "If you could have any superpower, what would it be and why?",
  "What's your opinion on artificial intelligence?",
  "Describe a challenge you overcame recently.",
  "What's your favorite childhood memory?",
  "If you could change one thing about the world, what would it be?",
  "What are your goals for the next five years?",
  "What advice would you give to your younger self?"
];

const TalkToMe = ({ onBackToGames }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscribedText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const startListening = () => {
    setTranscribedText('');
    setFeedback('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      await getFeedback();
    }
  };

  const getFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as an English teacher. Provide concise feedback (maximum 3 lines) on how to improve this spoken response to the question "${questions[currentQuestionIndex]}": "${transcribedText}"`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Invalid response format from API');
      }

      setFeedback(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback('Error getting feedback. Please try again.');
    }
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscribedText('');
      setFeedback('');
    } else {
      setGameComplete(true);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground">
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="text-6xl mb-8"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold mb-4 text-blue-600 dark:text-white"
          >
            Congratulations!
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl mb-8 text-center text-slate-600 dark:text-white/80"
          >
            You've mastered all the speaking challenges!
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-white/20 px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200 border border-blue-200 dark:border-white/20"
          >
            Return to Games
          </motion.button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-background dark:to-background/95 text-foreground">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBackToGames}
            className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-200 border border-blue-200 dark:border-white/20 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 dark:text-white/80">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="relative w-full h-2 mb-8 bg-slate-200 dark:bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-white"
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 dark:border-white/20"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-white">
              Talk To Me
            </h2>

            <div className="space-y-6">
              <div className="bg-blue-50/50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-200 dark:border-white/20">
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">Your Question:</h3>
                <p className="text-lg text-slate-700 dark:text-white/90">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${isListening 
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40 cursor-not-allowed'
                      : 'bg-green-50 dark:bg-white/10 text-green-600 dark:text-white hover:bg-green-100 dark:hover:bg-white/20 border border-green-200 dark:border-white/20'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? 'Listening...' : 'Start Speaking'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopListening}
                  disabled={!isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                    ${!isListening 
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/40 cursor-not-allowed'
                      : 'bg-red-50 dark:bg-white/10 text-red-600 dark:text-white hover:bg-red-100 dark:hover:bg-white/20 border border-red-200 dark:border-white/20'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop Speaking
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {transcribedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-slate-50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-white/20"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Your Response:</h4>
                    <p className="text-slate-700 dark:text-white/90">{transcribedText}</p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center gap-3 text-slate-600 dark:text-white/80"
                  >
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your response...
                  </motion.div>
                )}

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-blue-50 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-200 dark:border-white/20"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Feedback:</h4>
                    <p className="text-slate-700 dark:text-white/90">{feedback}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="bg-blue-500 dark:bg-white text-white dark:text-blue-900 hover:bg-blue-600 dark:hover:bg-white/90 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  Next Question
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TalkToMe;