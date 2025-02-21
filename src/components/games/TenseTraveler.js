import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GameCard,
  Button,
  ScoreDisplay,
  TimeLineProgress,
  PeriodBadge,
  QuestionCard,
  AnswerOption,
  FeedbackMessage,
  HelpPanel,
  GameHeader,
  PeriodTransition
} from './TenseTravelerUI';

// Game data and configurations
const tenseFeedback = {
  presentContinuous: {
    hint: "Think about actions happening right now in the current moment.",
    correct: "Great! You identified an action happening right now.",
    incorrect: "Remember: Present Continuous describes actions happening at this moment."
  },
  simplePresent: {
    hint: "Consider if this is a regular, habitual action or general truth.",
    correct: "Excellent! You recognized a regular or habitual action.",
    incorrect: "Think about whether this action happens regularly or is always true."
  },
  simplePast: {
    hint: "Think about completed actions in the past.",
    correct: "Perfect! You identified a completed past action.",
    incorrect: "Remember: Simple Past is for actions that were completed in the past."
  }
};

const errorMessages = {
  validation: "Validation Error: Please try your answer again.",
  network: "Connection error. Please check your connection and try again.",
  unexpected: "Something unexpected happened. Please try again.",
  timeout: "The request took too long. Please try again."
};

const PERIODS = ['ancientRome', 'medievalEngland', 'futureSpaceStation'];

const periodInfo = {
  ancientRome: {
    name: "Ancient Rome",
    description: "Experience the grandeur of the Roman Empire",
    theme: "period-ancient-rome"
  },
  medievalEngland: {
    name: "Medieval England",
    description: "Journey through the age of knights and castles",
    theme: "period-medieval-england"
  },
  futureSpaceStation: {
    name: "Future Space Station",
    description: "Explore the frontiers of space",
    theme: "period-future-space"
  }
};

const scenarios = {
  ancientRome: [
    {
      context: "At the Circus Maximus",
      scenario: "The chariots [race] around the track",
      options: ["race", "raced", "are racing", "will race"],
      correctAnswer: "are racing",
      explanation: "Present Continuous - the action is happening now during the race",
      hint: "Look at what's happening right in front of you"
    },
    {
      context: "In the Forum",
      scenario: "The senators [discuss] important matters",
      options: ["discuss", "discussed", "are discussing", "will discuss"],
      correctAnswer: "are discussing",
      explanation: "Present Continuous - the discussion is currently taking place",
      hint: "The debate is happening as you watch"
    },
    {
      context: "At the market",
      scenario: "The merchant [sell] exotic spices",
      options: ["sells", "sold", "is selling", "will sell"],
      correctAnswer: "is selling",
      explanation: "Present Continuous - the selling activity is happening now",
      hint: "You can see the merchant with customers right now"
    }
  ],
  medievalEngland: [
    {
      context: "In the castle courtyard",
      scenario: "Knights [practice] their swordplay",
      options: ["practice", "practiced", "are practicing", "will practice"],
      correctAnswer: "practice",
      explanation: "Simple Present - this is a regular, habitual action",
      hint: "Think about their daily routine"
    },
    {
      context: "At the village market",
      scenario: "The blacksmith [worked] all day yesterday",
      options: ["works", "worked", "is working", "will work"],
      correctAnswer: "worked",
      explanation: "Simple Past - the action was completed yesterday",
      hint: "The action is finished and happened in the past"
    },
    {
      context: "In the great hall",
      scenario: "The king [holds] court every morning",
      options: ["holds", "held", "is holding", "will hold"],
      correctAnswer: "holds",
      explanation: "Simple Present - this is a regular occurrence",
      hint: "This happens every day without fail"
    }
  ],
  futureSpaceStation: [
    {
      context: "In the control room",
      scenario: "The computer [monitors] all systems",
      options: ["monitors", "monitored", "is monitoring", "will monitor"],
      correctAnswer: "monitors",
      explanation: "Simple Present - this is a constant state",
      hint: "This is an ongoing function of the computer"
    },
    {
      context: "In the research lab",
      scenario: "Scientists [completed] their experiment",
      options: ["complete", "completed", "are completing", "will complete"],
      correctAnswer: "completed",
      explanation: "Simple Past - the experiment is now finished",
      hint: "They're already reviewing the results"
    },
    {
      context: "In the hydroponics bay",
      scenario: "The plants [grow] in zero gravity",
      options: ["grow", "grew", "are growing", "will grow"],
      correctAnswer: "grow",
      explanation: "Simple Present - this is a general fact",
      hint: "This is always true in space"
    }
  ]
};

const getFeedbackType = (scenario) => {
  if (scenario.correctAnswer.includes('are') || scenario.correctAnswer.includes('is')) {
    return 'presentContinuous';
  } else if (scenario.correctAnswer.endsWith('ed')) {
    return 'simplePast';
  }
  return 'simplePresent';
};

const STORAGE_KEYS = {
  HIGH_SCORE: 'tenseTraveler_highScore'
};

const loadHighScore = () => {
  try {
    const savedScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return savedScore ? parseInt(savedScore, 10) : 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
};

const saveHighScore = (score) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

const TenseTraveler = ({ onBackToGames }) => {
  // State management
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => loadHighScore());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // High score persistence
  useEffect(() => {
    const syncHighScore = () => {
      if (score > highScore) {
        saveHighScore(score);
      }
    };

    window.addEventListener('beforeunload', syncHighScore);
    return () => {
      window.removeEventListener('beforeunload', syncHighScore);
      syncHighScore();
    };
  }, [score, highScore]);

  // Game state access
  const currentPeriod = PERIODS[currentPeriodIndex];
  const currentScenarios = scenarios[currentPeriod];
  const currentScenario = currentScenarios?.[scenarioIndex];
  const periodData = periodInfo[currentPeriod];
  const feedbackType = currentScenario ? getFeedbackType(currentScenario) : null;

  // Error handling
  useEffect(() => {
    if (!currentScenarios || !currentScenario) {
      setError(errorMessages.unexpected);
    }
  }, [currentScenarios, currentScenario]);

  const handleAnswerSelect = async (answer) => {
    if (selectedAnswer !== null || !currentScenario) return;

    try {
      setSelectedAnswer(answer);
      const correct = answer === currentScenario.correctAnswer;
      setIsCorrect(correct);
      
      if (correct) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          saveHighScore(newScore);
        }
      }
      
      setShowFeedback(true);
    } catch (error) {
      console.error('Answer validation error:', error);
      setError(errorMessages.validation);
    }
  };

  const handleNextScenario = async () => {
    try {
      setShowFeedback(false);
      
      if (scenarioIndex < currentScenarios.length - 1) {
        setScenarioIndex(scenarioIndex + 1);
        resetState();
      } else {
        setIsTransitioning(true);
        
        if (currentPeriodIndex < PERIODS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setCurrentPeriodIndex(currentPeriodIndex + 1);
          setScenarioIndex(0);
          resetState();
        }
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setError(errorMessages.unexpected);
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setError(null);
  };

  const getFeedbackMessage = () => {
    if (error) return error;
    if (!feedbackType) return errorMessages.unexpected;
    return isCorrect
      ? tenseFeedback[feedbackType].correct
      : tenseFeedback[feedbackType].incorrect;
  };

  const getHintMessage = () => {
    if (!feedbackType) return "Think about the timing of the action.";
    return tenseFeedback[feedbackType].hint;
  };

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/20 to-destructive/30 p-8">
        <GameCard className="max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Oops!</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setSelectedAnswer(null);
                setShowFeedback(false);
              }}
              variant="destructive"
            >
              Try Again
            </Button>
          </div>
        </GameCard>
      </div>
    );
  }

  // Game Complete UI
  if (currentPeriodIndex >= PERIODS.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <GameCard>
            <div className="text-center">
              <h1 className="text-4xl font-heading font-bold text-primary mb-6">
                🎉 Game Complete! 🎉
              </h1>
              <p className="text-2xl mb-4">You've mastered verb tenses across time!</p>
              <div className="flex justify-center gap-8 mb-8">
                <ScoreDisplay label="Final Score" score={score} />
                <ScoreDisplay label="High Score" score={highScore} />
              </div>
              <Button onClick={onBackToGames} className="text-xl">
                Return to Games
              </Button>
            </div>
          </GameCard>
        </motion.div>
      </div>
    );
  }

  // Period Transition UI
  if (isTransitioning) {
    return (
      <div className={`min-h-screen bg-gradient-to-br p-8 ${periodData.theme}`}>
        <GameCard className="max-w-4xl mx-auto">
          <PeriodTransition
            periodName={periodData.name}
            score={score}
            highScore={highScore}
          />
        </GameCard>
      </div>
    );
  }

  // Main Game UI
  return (
    <div className={`min-h-screen bg-gradient-to-br p-8 ${periodData.theme}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentPeriod}-${scenarioIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto"
        >
          <GameCard>
            <GameHeader
              title={periodData.name}
              onBack={onBackToGames}
              onHelp={() => setShowHelp(!showHelp)}
              onPause={() => setIsPaused(!isPaused)}
              isPaused={isPaused}
            />

            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4">
                <ScoreDisplay label="Current Score" score={score} />
                <ScoreDisplay label="High Score" score={highScore} />
              </div>
              <div className="text-center">
                <PeriodBadge period={periodData.name} />
                <div className="mt-4">
                  <TimeLineProgress
                    periods={PERIODS}
                    currentPeriodIndex={currentPeriodIndex}
                  />
                  <p className="text-sm mt-2 text-muted-foreground">
                    Scenario {scenarioIndex + 1}/{currentScenarios.length}
                  </p>
                </div>
              </div>
            </div>

            <QuestionCard
              context={currentScenario.context}
              scenario={currentScenario.scenario}
              className="mb-8"
            />

            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentScenario.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  index={index}
                  selected={selectedAnswer === option}
                  correct={option === currentScenario.correctAnswer}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                />
              ))}
            </div>

            {showFeedback && (
              <FeedbackMessage
                isCorrect={isCorrect}
                message={getFeedbackMessage()}
                hint={!isCorrect && getHintMessage()}
              />
            )}

            {showFeedback && (
              <div className="text-center mt-4">
                <Button onClick={handleNextScenario}>
                  Continue →
                </Button>
              </div>
            )}

            {showHelp && (
              <HelpPanel>
                <p className="mb-4">Journey through history, read each scenario, and select the grammatically correct verb tense option to answer correctly and advance!</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Each time period presents unique scenarios from different historical eras</li>
                  <li>Read the context and scenario carefully to understand when the action takes place</li>
                  <li>Choose the correct verb tense that matches the time of the action</li>
                  <li>Learn from feedback to improve your understanding of verb tenses</li>
                </ul>
                <p className="mt-4 text-muted-foreground italic">{getHintMessage()}</p>
              </HelpPanel>
            )}
          </GameCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TenseTraveler;