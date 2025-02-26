import React from 'react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

// Icons (using emoji as placeholders - you can replace with actual icon components)
const Icons = {
  games: "🎮",
  topics: "📚",
  wordDrop: "🔤",
  markTheWords: "✏️",
  dragzilla: "🐉",
  idiomMatcher: "🔍",
  achievement: "🏆",
  streak: "🔥"
};

const gameDescriptions = {
  wordDrop: "Challenge yourself with our Word Drop game! Match falling words with their correct grammatical categories before they hit the bottom.",
  markTheWords: "Improve your grammar by identifying specific word types in sentences. Perfect for learning parts of speech!",
  dragzilla: "A fun drag-and-drop game where you arrange words to form grammatically correct sentences.",
  idiomMatcher: "Master English idioms by matching them with their correct meanings. Expand your vocabulary with common expressions!"
};

const StartPage = ({ onTopicSelect, onShowGames, onGameSelect }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const shimmer = {
    hidden: { backgroundPosition: '200% 0' },
    show: { 
      backgroundPosition: '-200% 0',
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "linear"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-time-pattern opacity-5 pointer-events-none"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-20 text-4xl opacity-10 pointer-events-none text-indigo-500"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {Icons.games}
      </motion.div>
      <motion.div 
        className="absolute bottom-40 left-20 text-4xl opacity-10 pointer-events-none text-purple-500"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        {Icons.topics}
      </motion.div>
      
      <div className="container px-4 py-16 mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-heading font-bold mb-6"
            variants={shimmer}
            initial="hidden"
            animate="show"
            style={{
              backgroundSize: '200% 100%',
              backgroundImage: 'linear-gradient(to right, #4F46E5, #7C3AED, #4F46E5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Master English Grammar
          </motion.h1>
          
          <motion.p 
            className="text-xl font-medium text-indigo-900/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Choose your learning path and embark on an interactive journey to improve your English skills
          </motion.p>
          
          {/* Quick Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-indigo-200 shadow-sm">
              <span className="text-indigo-600">{Icons.achievement}</span>
              <span className="text-sm font-semibold text-indigo-800">8 Achievements</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-purple-200 shadow-sm">
              <span className="text-purple-600">{Icons.streak}</span>
              <span className="text-sm font-semibold text-purple-800">Continue your streak</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Options */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
        >
          {/* Games Card */}
          <motion.div variants={item}>
            <motion.div
              className="h-full relative bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl cursor-pointer group overflow-hidden rounded-xl
                border border-indigo-100 hover:border-indigo-400
                before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br
                before:from-indigo-500/90 before:to-indigo-600/90
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                transition-all duration-300"
              whileHover={{
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onShowGames}
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300 text-indigo-500 group-hover:text-white">{Icons.games}</span>
                  <h3 className="text-2xl font-semibold text-indigo-800 group-hover:text-white transition-colors duration-300">
                    Interactive Games
                  </h3>
                </div>
                <p className="text-sm text-indigo-600/70 font-medium group-hover:text-white/90 transition-colors duration-300 mb-4">
                  Learn through fun and engaging activities
                </p>
                <p className="text-indigo-700/80 font-medium group-hover:text-white/80 transition-colors duration-300 mb-6">
                  Practice your skills with our collection of interactive language games designed to make learning enjoyable.
                </p>
                <div className="flex justify-end">
                  <div className="flex items-center font-medium text-indigo-600 group-hover:text-white transition-colors duration-300">
                    Explore Games <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Topics Card */}
          <motion.div variants={item}>
            <motion.div
              className="h-full relative bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl cursor-pointer group overflow-hidden rounded-xl
                border border-purple-100 hover:border-purple-400
                before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br
                before:from-purple-500/90 before:to-purple-600/90
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                transition-all duration-300"
              whileHover={{
                y: -5,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTopicSelect('browseTopics')}
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300 text-purple-500 group-hover:text-white">{Icons.topics}</span>
                  <h3 className="text-2xl font-semibold text-purple-800 group-hover:text-white transition-colors duration-300">
                    Topic Library
                  </h3>
                </div>
                <p className="text-sm text-purple-600/70 font-medium group-hover:text-white/90 transition-colors duration-300 mb-4">
                  Structured learning paths
                </p>
                <p className="text-purple-700/80 font-medium group-hover:text-white/80 transition-colors duration-300 mb-6">
                  Explore our comprehensive collection of grammar topics and structured lessons.
                </p>
                <div className="flex justify-end">
                  <div className="flex items-center font-medium text-purple-600 group-hover:text-white transition-colors duration-300">
                    Browse Topics <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Game Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent flex-grow max-w-[100px]"></div>
            <h2 className="text-2xl font-heading font-semibold text-center px-4 text-indigo-800">Popular Games</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-grow max-w-[100px]"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(gameDescriptions).map(([game, description], index) => (
              <motion.div 
                key={game}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <motion.button
                      className="group relative bg-gradient-to-br from-white to-gray-50 w-full p-4 rounded-lg
                        transition-all duration-200 ease-out flex items-center gap-3
                        border border-indigo-100 hover:border-indigo-400
                        before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br
                        before:from-indigo-500/90 before:to-indigo-600/90
                        before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150
                        shadow-sm hover:shadow-md"
                      whileHover={{
                        y: -2,
                        scale: 1.03,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onGameSelect(game.replace(/([A-Z])/g, ' $1').trim())}
                    >
                      <span className="relative z-10 text-xl opacity-70 group-hover:opacity-100 transition-opacity text-indigo-500 group-hover:text-white">
                        {Icons[game] || "🎲"}
                      </span>
                      <span className="relative z-10 capitalize font-medium text-indigo-700 group-hover:text-white
                        transition-colors duration-150 ease-out">
                        {game.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </motion.button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4 border-indigo-100 bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl text-indigo-500">{Icons[game] || "🎲"}</span>
                        <h4 className="font-semibold capitalize text-indigo-800">{game.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      </div>
                      <p className="text-sm text-indigo-700/80 font-medium">{description}</p>
                      <div className="mt-2 pt-2 border-t border-indigo-100 flex justify-between items-center">
                        <span className="text-xs text-indigo-600 font-medium">Difficulty: Beginner</span>
                        <span className="text-xs text-indigo-600 font-medium">~5 min</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ))}
          </div>
          
          {/* "View All Games" button */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button 
              className="group relative bg-gradient-to-br from-white to-gray-50 px-4 py-2 rounded-lg
                transition-all duration-200 ease-out flex items-center justify-center mx-auto
                border border-indigo-100 hover:border-indigo-400
                before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br
                before:from-indigo-500/90 before:to-indigo-600/90
                before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150
                shadow-sm hover:shadow-md"
              whileHover={{
                y: -2,
                scale: 1.03,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onShowGames}
            >
              <span className="relative z-10 font-medium text-indigo-700 group-hover:text-white
                transition-colors duration-150 ease-out">
                View All Games <span className="ml-1">→</span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Footer Section */}
        <motion.div 
          className="mt-20 pt-8 border-t border-indigo-100 text-center text-sm text-indigo-700/70 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Continue your learning journey with our comprehensive English grammar resources.</p>
          <p className="mt-2">Track your progress, earn achievements, and master English at your own pace.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default StartPage;