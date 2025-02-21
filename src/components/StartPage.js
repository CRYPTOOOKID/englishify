import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container px-4 py-16 mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-heading font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Master English Grammar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your learning path and embark on an interactive journey to improve your English skills
          </p>
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
            <Card className="h-full hover:border-primary/50 cursor-pointer group" onClick={onShowGames}>
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Interactive Games
                </CardTitle>
                <CardDescription>
                  Learn through fun and engaging activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Practice your skills with our collection of interactive language games designed to make learning enjoyable.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topics Card */}
          <motion.div variants={item}>
            <Card 
              className="h-full hover:border-primary/50 cursor-pointer group" 
              onClick={() => onTopicSelect('browseTopics')}
            >
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Topic Library
                </CardTitle>
                <CardDescription>
                  Structured learning paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore our comprehensive collection of grammar topics and structured lessons.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Game Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-heading text-center mb-8">Popular Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(gameDescriptions).map(([game, description]) => (
              <HoverCard key={game}>
                <HoverCardTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 text-left justify-start"
                    onClick={() => onGameSelect(game.replace(/([A-Z])/g, ' $1').trim())}
                  >
                    <span className="capitalize">{game.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-sm text-muted-foreground">{description}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StartPage;