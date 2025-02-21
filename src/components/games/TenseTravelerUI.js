import React from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, ArrowLeft, Play, Pause } from 'lucide-react';

export const GameCard = ({ children, className = '' }) => (
  <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border-2 border-primary hover:bg-primary/10',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-card text-card-foreground rounded-xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const ScoreDisplay = ({ label, score }) => (
  <div className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-2xl font-bold">{score}</p>
  </div>
);

export const ProgressBar = ({ current, total, className = '' }) => (
  <div className={`h-2 bg-secondary/20 rounded-full overflow-hidden ${className}`}>
    <motion.div
      className="h-full bg-primary rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

export const TimeLineProgress = ({ periods, currentPeriodIndex }) => (
  <div className="flex gap-1">
    {periods.map((_, index) => (
      <div
        key={index}
        className={`h-2 w-16 rounded ${
          index < currentPeriodIndex
            ? 'bg-green-500'
            : index === currentPeriodIndex
            ? 'bg-primary'
            : 'bg-secondary/20'
        }`}
      />
    ))}
  </div>
);

export const PeriodBadge = ({ period }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground">
    <Clock className="w-4 h-4" />
    <span className="font-medium">{period}</span>
  </div>
);

export const QuestionCard = ({ context, scenario, className = '' }) => (
  <Card className={`bg-gradient-to-br from-card to-card/95 ${className}`}>
    <div className="text-xl text-muted-foreground mb-4">{context}</div>
    <div className="text-2xl font-heading font-bold text-center mb-8">{scenario}</div>
  </Card>
);

export const AnswerOption = ({ 
  option, 
  index, 
  selected, 
  correct, 
  onClick, 
  disabled 
}) => {
  const letters = ['a', 'b', 'c', 'd'];
  const baseStyles = 'w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 flex items-center gap-3';
  const getStyles = () => {
    if (!selected) return 'bg-white border-2 border-accent/20 hover:border-primary/50';
    if (correct) return 'bg-green-500 text-white';
    return 'bg-destructive text-white';
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${getStyles()} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
        {letters[index]}
      </span>
      {option}
    </motion.button>
  );
};

export const FeedbackMessage = ({ isCorrect, message, hint }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center"
  >
    <p className={`text-xl font-bold mb-2 ${
      isCorrect ? 'text-green-600' : 'text-destructive'
    }`}>
      {message}
    </p>
    {!isCorrect && hint && (
      <p className="text-muted-foreground mb-4">{hint}</p>
    )}
  </motion.div>
);

export const HelpPanel = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-accent/5 border border-accent/20 rounded-xl p-6"
  >
    <div className="flex items-start gap-3">
      <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-lg mb-2">How to Play:</h3>
        {children}
      </div>
    </div>
  </motion.div>
);

export const GameHeader = ({ title, onBack, onHelp, onPause, isPaused }) => (
  <div className="flex justify-between items-center mb-8">
    <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
    <h1 className="text-3xl font-heading font-bold text-center">{title}</h1>
    <div className="flex gap-2">
      <Button variant="ghost" onClick={onHelp}>
        <HelpCircle className="w-4 h-4" />
      </Button>
      <Button variant="ghost" onClick={onPause}>
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </Button>
    </div>
  </div>
);

export const PeriodTransition = ({ periodName, score, highScore }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center"
  >
    <h2 className="text-3xl font-heading font-bold mb-4">{periodName} Complete!</h2>
    <div className="flex justify-center gap-8 mb-6">
      <ScoreDisplay label="Current Score" score={score} />
      <ScoreDisplay label="High Score" score={highScore} />
    </div>
    <p className="text-lg mb-8 text-muted-foreground">Preparing next time period...</p>
    <ProgressBar current={1} total={1} className="w-full max-w-md mx-auto" />
  </motion.div>
);