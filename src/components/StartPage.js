import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StartPage = ({ onTopicSelect, onShowGames, onGameSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGameSelection, setShowGameSelection] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl font-bold text-center mb-8 mx-auto
            font-['Inter var'] tracking-tight leading-tight
            bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text
            w-full"
        >
          English Grammar
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl text-center text-gray-600 mb-12 font-['Italianno'] tracking-wide
            max-w-2xl mx-auto leading-relaxed"
        >
          (Choose Your Learning Path)
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          <motion.button
            key="games"
            variants={item}
            onClick={onShowGames}
            className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-lg
              transition-all duration-200 ease-out min-h-[150px] flex flex-col items-center justify-center
              border border-gray-100 hover:border-purple-400
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br
              before:from-purple-500/90 before:to-indigo-600/90
              before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150
              shadow-sm hover:shadow-md"
            whileHover={{
              y: -2,
              scale: 1.03,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 text-xl font-medium text-gray-700 group-hover:text-white
              transition-colors duration-150 ease-out"
            >
              Games
            </span>
          </motion.button>
          <motion.button
            key="topics"
            variants={item}
            onClick={() => onTopicSelect('browseTopics')}
            className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-lg
              transition-all duration-200 ease-out min-h-[150px] flex flex-col items-center justify-center
              border border-gray-100 hover:border-purple-400
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br
              before:from-purple-500/90 before:to-indigo-600/90
              before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150
              shadow-sm hover:shadow-md"
            whileHover={{
              y: -2,
              scale: 1.03,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10 text-xl font-medium text-gray-700 group-hover:text-white
              transition-colors duration-150 ease-out"
            >
              Topics
            </span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="relative w-[280px] mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-xl text-gray-700 font-medium">
                {showGameSelection ? "which game" : "I want to"}
              </span>
              {!showGameSelection && (
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative text-xl font-medium text-purple-600 focus:outline-none group
                    px-4 py-1 rounded-md bg-purple-50 border border-purple-200 hover:border-purple-400
                    transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  title="Click to show options"
                >
                  <span>select</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              )}
              {showGameSelection && (
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="relative text-xl font-medium text-purple-600 focus:outline-none group
                    px-4 py-1 rounded-md bg-purple-50 border border-purple-200 hover:border-purple-400
                    transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  title="Click to select a game"
                >
                  <span>select</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              )}
            </div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <motion.button
                    onClick={() => {
                      setShowGameSelection(true);
                      setIsOpen(true);
                    }}
                    className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                      transition-colors duration-150 flex items-center space-x-3"
                    whileHover={{ x: 4 }}
                  >
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Play Games</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      onTopicSelect('browseTopics');
                      setIsOpen(false);
                      setShowGameSelection(false);
                    }}
                    className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                      transition-colors duration-150 flex items-center space-x-3"
                    whileHover={{ x: 4 }}
                  >
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Learn Topics</span>
                  </motion.button>

                  {showGameSelection && (
                    <>
                      <div className="w-full h-px bg-gray-200 my-2"></div>
                      <motion.button
                        onClick={() => {
                          onGameSelect('wordDrop');
                          setIsOpen(false);
                          setShowGameSelection(false);
                        }}
                        className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                          transition-colors duration-150 flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                      >
                        <span>Word Drop Challenge</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          onGameSelect('markTheWords');
                          setIsOpen(false);
                          setShowGameSelection(false);
                        }}
                        className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                          transition-colors duration-150 flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                      >
                        <span>Mark the Words</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          onGameSelect('dragzilla');
                          setIsOpen(false);
                          setShowGameSelection(false);
                        }}
                        className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                          transition-colors duration-150 flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                      >
                        <span>Dragzilla</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          onGameSelect('idiomMatcher');
                          setIsOpen(false);
                          setShowGameSelection(false);
                        }}
                        className="w-full px-6 py-4 text-left text-gray-700 hover:bg-purple-50
                          transition-colors duration-150 flex items-center space-x-3"
                        whileHover={{ x: 4 }}
                      >
                        <span>Idiom Matcher</span>
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartPage;