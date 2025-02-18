import React from 'react';
import { motion } from 'framer-motion';

const GameSelector = ({ onGameSelect, onBackToStart }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-8"
      >
        <div className="flex items-center mb-8">
          <button
            onClick={onBackToStart}
            className="btn btn-outline mr-8"
          >
            ← Back to Start Page
          </button>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl font-bold text-center
              font-['Inter var'] tracking-tight leading-tight
              bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text"
          >
            English Grammar Games
          </motion.h1>
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl text-center text-gray-600 mb-12 font-['Italianno'] tracking-wide
            max-w-2xl mx-auto leading-relaxed"
        >
          (Select a Game to Begin)
        </motion.h2>

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
          className="grid grid-cols-1 gap-8 max-w-2xl mx-auto"
        >
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            onClick={() => onGameSelect('wordDrop')}
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
              Word Drop Challenge
            </span>
          </motion.button>

          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            onClick={() => onGameSelect('markTheWords')}
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
              Mark the Words
            </span>
          </motion.button>

          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            onClick={() => onGameSelect('dragzilla')}
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
              Dragzilla
            </span>
          </motion.button>

          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            onClick={() => onGameSelect('idiomMatcher')}
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
              Idiom Matcher
            </span>
          </motion.button>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default GameSelector;