import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyA6MdoSLwUd2D8kf1goBDg-92nvMTq2j9A';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
  const [animateBackground, setAnimateBackground] = useState(false);
  
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
    
    // Add animation after a short delay when dark mode is enabled
    if (isDarkMode) {
      const timer = setTimeout(() => {
        setAnimateBackground(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimateBackground(false);
    }
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
      // Try with API key as a query parameter first
      let response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Act as an expert English teacher. For the spoken response to the question "${questions[currentQuestionIndex]}", analyze the answer: "${transcribedText}". Provide up to three concise lines of plain text feedback detailing any grammatical or structural issues and offering specific suggestions for improvement without using any extra formatting symbols.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      });

      // If first attempt fails, try with Authorization header
      if (!response.ok && response.status === 401) {
        console.log("Trying with Authorization header instead of query parameter");
        response = await fetch(GEMINI_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Act as an expert English teacher. For the spoken response to the question "${questions[currentQuestionIndex]}", analyze the answer: "${transcribedText}". Provide up to three concise lines of plain text feedback detailing any grammatical or structural issues and offering specific suggestions for improvement without using any extra formatting symbols.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200
            }
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Invalid response format from API');
      }

      setFeedback(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback(`Error getting feedback: ${error.message}. Please try again.`);
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
      <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900' : 'bg-gradient-to-br from-background to-background/95'} text-foreground`}>
        {isDarkMode && animateBackground && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="stars-container absolute inset-0 opacity-70">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center min-h-screen p-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="text-7xl mb-8"
          >
            {isDarkMode ? '✨' : '🎉'}
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-blue-600'}`}
          >
            Congratulations!
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`text-xl mb-8 text-center ${isDarkMode ? 'text-indigo-100/80' : 'text-slate-600'}`}
          >
            You've mastered all the speaking challenges!
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToGames}
            className={`px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            Return to Games
          </motion.button>
        </div>
        
        {/* Add a custom style tag for the twinkle animation */}
        {isDarkMode && (
          <style jsx="true">{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 1; }
            }
          `}</style>
        )}
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 to-white'
    } text-foreground transition-colors duration-500`}>
      
      {/* Animated background elements for dark mode */}
      {isDarkMode && animateBackground && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-container absolute inset-0 opacity-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="container mx-auto p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBackToGames}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isDarkMode
                ? 'bg-indigo-950/50 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-700/30 shadow-[0_0_10px_rgba(79,70,229,0.2)]'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            } backdrop-blur-sm`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </motion.button>
          
          <div className="flex items-center gap-4">
            <div className={`text-sm ${isDarkMode ? 'text-indigo-200/80' : 'text-slate-600'}`}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? 'bg-indigo-900/60 text-yellow-300 hover:bg-indigo-800/70 shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
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
            </motion.button>
          </div>
        </div>

        <div className={`relative w-full h-2 mb-8 rounded-full overflow-hidden ${
          isDarkMode ? 'bg-indigo-900/50' : 'bg-slate-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`absolute top-0 left-0 h-full ${
              isDarkMode
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                : 'bg-blue-500'
            }`}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl shadow-xl p-8 mb-8 transition-all duration-500 ${
              isDarkMode
                ? 'bg-slate-900/70 border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.15)]'
                : 'bg-white/80 border border-slate-200'
            } backdrop-blur-md`}
          >
            <h2 className={`text-3xl font-bold mb-8 text-center ${
              isDarkMode ? 'text-indigo-300' : 'text-blue-600'
            }`}>
              Talk To Me
            </h2>

            <div className="space-y-6">
              <div className={`rounded-xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-indigo-950/50 border border-indigo-700/30'
                  : 'bg-blue-50/50 border border-blue-200'
              } backdrop-blur-sm`}>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-indigo-200' : 'text-slate-800'
                }`}>Your Question:</h3>
                <p className={`text-lg ${
                  isDarkMode ? 'text-indigo-100/90' : 'text-slate-700'
                }`}>
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isListening
                      ? isDarkMode
                        ? 'bg-slate-800/50 text-indigo-300/40 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-800/40 border border-emerald-700/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !isListening
                      ? isDarkMode
                        ? 'bg-slate-800/50 text-indigo-300/40 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-rose-900/30 text-rose-300 hover:bg-rose-800/40 border border-rose-700/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  }`}
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
                    key="transcribed-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`rounded-xl p-6 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-slate-800/50 border border-slate-700/50'
                        : 'bg-slate-50 border border-slate-200'
                    } backdrop-blur-sm`}
                  >
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-indigo-200' : 'text-slate-800'
                    }`}>Your Response:</h4>
                    <p className={`${
                      isDarkMode ? 'text-indigo-100/90' : 'text-slate-700'
                    }`}>{transcribedText}</p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    key="loading-spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex justify-center items-center gap-3 ${
                      isDarkMode ? 'text-indigo-200/80' : 'text-slate-600'
                    }`}
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
                    key="feedback"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`rounded-xl p-6 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-indigo-900/40 border border-indigo-700/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                        : 'bg-blue-50 border border-blue-200'
                    } backdrop-blur-sm`}
                  >
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-indigo-200' : 'text-slate-800'
                    }`}>Feedback:</h4>
                    <p className={`${
                      isDarkMode ? 'text-indigo-100/90' : 'text-slate-700'
                    }`}>{feedback}</p>
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
                  className={`px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center gap-2 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
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
      
      {/* Add a custom style tag for the twinkle animation */}
      {isDarkMode && (
        <style jsx="true">{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>
      )}
    </div>
  );
};

export default TalkToMe;