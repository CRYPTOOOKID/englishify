import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';

// Modern icons using emoji (you can replace with SVG icons for production)
const Icons = {
  logo: "✏️",
  games: "🎮",
  topics: "📚",
  wordDrop: "🔤",
  markTheWords: "✏️",
  dragzilla: "🐉",
  idiomMatcher: "🔍",
  achievement: "🏆",
  streak: "🔥",
  menu: "☰",
  play: "▶️",
  learn: "📖",
  practice: "🔄",
  github: "🌐",
  twitter: "🐦",
  discord: "💬"
};

// Game descriptions with minimal text
const gameDescriptions = {
  wordDrop: "Match falling words with their grammatical categories.",
  markTheWords: "Identify specific word types in sentences.",
  dragzilla: "Arrange words to form grammatically correct sentences.",
  idiomMatcher: "Match idioms with their correct meanings."
};

const StartPage = ({ onTopicSelect, onShowGames, onGameSelect }) => {
  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const gamesRef = useRef(null);
  const footerRef = useRef(null);
  
  // InView hooks for scroll-triggered animations
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 });
  const gamesInView = useInView(gamesRef, { once: false, amount: 0.3 });
  const footerInView = useInView(footerRef, { once: false, amount: 0.3 });
  
  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Smooth scroll function
  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Feature cards data
  const features = [
    {
      icon: Icons.games,
      title: "Interactive Games",
      description: "Practice your skills with our collection of interactive language games designed to make learning enjoyable.",
      action: "Explore Games",
      onClick: onShowGames,
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
      hoverColor: "group-hover:bg-teal-600",
      textColor: "text-teal-800"
    },
    {
      icon: Icons.topics,
      title: "Topic Library",
      description: "Explore our comprehensive collection of grammar topics and structured lessons.",
      action: "Browse Topics",
      onClick: () => onTopicSelect('browseTopics'),
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600",
      hoverColor: "group-hover:bg-amber-600",
      textColor: "text-amber-800"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-time-pattern opacity-3 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-teal-50 to-transparent opacity-40 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-amber-50 to-transparent opacity-40 rounded-tr-full"></div>
      
      {/* Header with navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl text-slate-700 font-bold">{Icons.logo}</span>
              <span className="font-heading font-semibold text-xl text-slate-800">GrammarPlay</span>
            </motion.div>
            
            {/* Navigation */}
            <motion.nav
              className="hidden md:flex items-center gap-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                onClick={() => scrollTo(heroRef)}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                onClick={() => scrollTo(featuresRef)}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                onClick={() => scrollTo(gamesRef)}
              >
                Games
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                onClick={() => onTopicSelect('browseTopics')}
              >
                Topics
              </Button>
            </motion.nav>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                className="bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md transition-all"
                onClick={onShowGames}
              >
                Start Learning
              </Button>
            </motion.div>
            
            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-slate-700 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {Icons.menu}
            </motion.button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 md:py-32 overflow-hidden">
          <motion.div
            className="container px-4 mx-auto text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              style={{ y: parallaxY }}
              className="max-w-3xl mx-auto"
            >
              <motion.div
                className="inline-block mb-4 px-4 py-1 rounded-full bg-teal-50 border border-teal-100"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-medium text-teal-700">Interactive English Learning</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-heading font-bold mb-6 text-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                Master English Grammar Through Play
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl font-medium text-slate-600 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                Engaging games and exercises designed to make learning English grammar intuitive and enjoyable
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                  onClick={onShowGames}
                >
                  <span className="mr-2">{Icons.play}</span> Play Games
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 px-8 py-6 rounded-lg text-lg hover:bg-slate-50 transition-all w-full sm:w-auto"
                  onClick={() => onTopicSelect('browseTopics')}
                >
                  <span className="mr-2">{Icons.learn}</span> Browse Topics
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Stats cards */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-teal-600">{Icons.achievement}</span>
                  <span className="text-sm font-medium text-slate-800">8 Achievement Badges</span>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-amber-600">{Icons.streak}</span>
                  <span className="text-sm font-medium text-slate-800">Continue your 3-day streak</span>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-indigo-600">{Icons.games}</span>
                  <span className="text-sm font-medium text-slate-800">8 Interactive Games</span>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section ref={featuresRef} className="py-20 relative bg-slate-50">
          <motion.div
            className="container px-4 mx-auto"
            style={{ y: useTransform(scrollYProgress, [0.2, 0.4], [50, 0]) }}
          >
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-slate-800">How We Make Learning Fun</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Our approach combines interactive games with structured learning paths</p>
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              animate={featuresInView ? "show" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={item}>
                  <Card className={`h-full group overflow-hidden hover:shadow-lg transition-all duration-300 border ${feature.color}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.iconColor} bg-white border ${feature.color.replace('bg-', 'border-')} group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <CardTitle className={`text-2xl ${feature.textColor}`}>
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 text-base mb-4">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button
                        variant="ghost"
                        className={`${feature.iconColor} hover:bg-transparent p-0 flex items-center gap-2 group`}
                        onClick={feature.onClick}
                      >
                        <span>{feature.action}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
        
        {/* Games Showcase */}
        <section ref={gamesRef} className="py-20 relative">
          <motion.div
            className="container px-4 mx-auto"
            style={{ y: useTransform(scrollYProgress, [0.4, 0.7], [50, 0]) }}
          >
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={gamesInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-slate-800">Popular Games</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Jump right in and start improving your English skills</p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
              variants={container}
              initial="hidden"
              animate={gamesInView ? "show" : "hidden"}
            >
              {Object.entries(gameDescriptions).map(([game, description], index) => (
                <motion.div
                  key={game}
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Card className={`h-full cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 ${index % 2 === 0 ? 'bg-teal-50/50' : 'bg-amber-50/50'}`}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${index % 2 === 0 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                            <span className="text-3xl">
                              {Icons[game] || "🎲"}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold capitalize mb-2 text-slate-800">
                            {game.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-sm text-slate-600 mb-4">
                            {description.substring(0, 40)}...
                          </p>
                          <Button
                            variant="outline"
                            className={`mt-auto ${index % 2 === 0 ? 'border-teal-200 text-teal-700 hover:bg-teal-100/50' : 'border-amber-200 text-amber-700 hover:bg-amber-100/50'}`}
                            onClick={() => onGameSelect(game.replace(/([A-Z])/g, ' $1').trim())}
                          >
                            Play Now
                          </Button>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4 border-slate-200 bg-white shadow-lg">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl ${index % 2 === 0 ? 'text-teal-600' : 'text-amber-600'}`}>
                            {Icons[game] || "🎲"}
                          </span>
                          <h4 className="font-semibold capitalize text-slate-800">
                            {game.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-600">{description}</p>
                        <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-xs text-slate-500">Difficulty: Beginner</span>
                          <span className="text-xs text-slate-500">~5 min</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
            
            {/* "View All Games" button */}
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={gamesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={onShowGames}
              >
                View All Games <span className="ml-1">→</span>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </main>
      
      {/* Footer */}
      <footer ref={footerRef} className="bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl text-slate-700">{Icons.logo}</span>
                <span className="font-heading font-semibold text-xl text-slate-800">GrammarPlay</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Making English grammar learning intuitive and enjoyable through interactive games and exercises.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  {Icons.github}
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  {Icons.twitter}
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  {Icons.discord}
                </Button>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900" onClick={onShowGames}>
                    Games
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900" onClick={() => onTopicSelect('browseTopics')}>
                    Topics
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900">
                    Resources
                  </Button>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900">
                    Grammar Guide
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900">
                    Vocabulary Lists
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-600 hover:text-slate-900">
                    Practice Exercises
                  </Button>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Stay Updated</h4>
              <p className="text-sm text-slate-600 mb-4">
                Subscribe to our newsletter for the latest updates and new games.
              </p>
              <div className="flex">
                <Button className="bg-slate-800 text-white hover:bg-slate-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-600"
            initial={{ opacity: 0 }}
            animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p>© 2025 GrammarPlay. All rights reserved.</p>
            <p className="mt-2">Continue your learning journey with our comprehensive English grammar resources.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default StartPage;