import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Components
const ProgressBar = ({ current, total }) => (
  <div className="w-4/5 max-w-2xl mb-4">
    <div className="bg-gray-200 h-2 rounded-full">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
    <p className="text-center mt-2 text-gray-600">
      Question {current + 1} of {total}
    </p>
  </div>
);

const CrossroadsVisual = ({ selectedAnswer, correctAnswer }) => (
  <div className="relative w-48 h-48 mb-8">
    <div className="absolute w-full h-12 bg-gray-300 top-1/2 transform -translate-y-1/2" />
    <div className="absolute w-12 h-full bg-gray-300 left-1/2 transform -translate-x-1/2" />
    {selectedAnswer !== null && (
      <div 
        className={`absolute w-6 h-24 ${selectedAnswer === correctAnswer ? 'bg-green-500' : 'bg-red-500'} transition-all duration-300`}
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${90 * correctAnswer}deg)`,
          transformOrigin: 'center'
        }}
      />
    )}
  </div>
);

const AnswerButton = ({ index, option, isSelected, isCorrect, isDisabled, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-4 rounded-lg shadow-md transition-colors border-2 
      ${isSelected && isCorrect ? 'bg-green-100 border-green-500' :
        isSelected && !isCorrect ? 'bg-red-100 border-red-500' :
        isDisabled ? 'bg-white opacity-70' : 'bg-white hover:bg-gray-50'}
      ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    disabled={isDisabled}
  >
    <span className={`w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full mr-4 
      ${isDisabled && !isCorrect ? 'opacity-70' : ''}`}>
      {String.fromCharCode(65 + index)}
    </span>
    <span className="text-left">{option}</span>
  </button>
);

// Game scenarios data
const scenarios = [
  {
    scenario: "You're planning a vacation next summer.",
    question: "What's your plan?",
    options: [
      "If I save money, I will go to Europe.",
      "If I saved money, I would go to Europe.",
      "If I had saved money, I would have gone to Europe.",
      "If I will save money, I will go to Europe."
    ],
    correctAnswer: 0,
    correctExplanation: "Correct! First conditional for real future plans.",
    incorrectExplanation: "Incorrect. This is about a real future plan."
  },
  {
    scenario: "You didn't bring your umbrella and now it's raining.",
    question: "Express your regret.",
    options: [
      "If I bring my umbrella, I will stay dry.",
      "If I brought my umbrella, I would stay dry.",
      "If I had brought my umbrella, I would have stayed dry.",
      "If I will bring my umbrella, I will stay dry."
    ],
    correctAnswer: 2,
    correctExplanation: "Correct! Third conditional for past regrets.",
    incorrectExplanation: "Incorrect. Use third conditional for past situations."
  },
  {
    scenario: "Your friend is asking about learning a new language.",
    question: "What advice would you give?",
    options: [
      "If you practice daily, you will improve quickly.",
      "If you practiced daily, you would improve quickly.",
      "If you had practiced daily, you would have improved quickly.",
      "If you will practice daily, you will improve quickly."
    ],
    correctAnswer: 0,
    correctExplanation: "Correct! First conditional for real possibilities.",
    incorrectExplanation: "Incorrect. This is advice about a real possibility."
  },
  {
    scenario: "You're dreaming about winning the lottery.",
    question: "What would you do?",
    options: [
      "If I win the lottery, I will buy a house.",
      "If I won the lottery, I would buy a house.",
      "If I had won the lottery, I would have bought a house.",
      "If I will win the lottery, I will buy a house."
    ],
    correctAnswer: 1,
    correctExplanation: "Correct! Second conditional for hypothetical situations.",
    incorrectExplanation: "Incorrect. Use second conditional for unlikely situations."
  },
  {
    scenario: "Your car broke down on the highway yesterday.",
    question: "Express the situation.",
    options: [
      "If I check my car, this won't happen.",
      "If I checked my car, this wouldn't happen.",
      "If I had checked my car, this wouldn't have happened.",
      "If I will check my car, this won't happen."
    ],
    correctAnswer: 2,
    correctExplanation: "Correct! Third conditional for past regrets.",
    incorrectExplanation: "Incorrect. This is about a past situation."
  },
  {
    scenario: "Ice melts above 0 degrees Celsius.",
    question: "Complete the sentence using a conditional.",
    options: [
      "If you heat ice above 0 degrees Celsius, it will melt.",
      "If you heated ice above 0 degrees Celsius, it would melt.",
      "If you had heated ice above 0 degrees Celsius, it would have melted.",
      "If you heat ice above 0 degrees Celsius, it melts."
    ],
    correctAnswer: 3,
    correctExplanation: "Correct. Zero Conditional for a general truth.",
    incorrectExplanation: "Incorrect. Consider a statement of scientific fact."
  },
  {
    scenario: "You're going to a job interview tomorrow.",
    question: "Complete the sentence",
    options: [
      "If I prepare well, I do well in the interview.",
      "If I prepared well, I would do well in the interview.",
      "If I had prepared well, I would have done well in the interview.",
      "If I prepare well, I will do well in the interview."
    ],
    correctAnswer: 3,
    correctExplanation: "Correct! First Conditional: real possibility.",
    incorrectExplanation: "Incorrect. Focus on a likely future outcome."
  },
  {
    scenario: "You wish you could fly.",
    question: "Complete the sentence with suitable conditional",
    options: [
      "If I fly, I travel quickly.",
      "If I could fly, I would travel quickly.",
      "If I had been able to fly, I would have traveled quickly.",
      "If I can fly, I will travel quickly."
    ],
    correctAnswer: 1,
    correctExplanation: "Correct. Second Conditional: hypothetical/imaginary situation.",
    incorrectExplanation: "Incorrect. This is a hypothetical wish."
  },
  {
    scenario: "You didn't water your plants last week, and they died.",
    question: "What is the consequence?",
    options: [
      "If I water my plants, they live.",
      "If I watered my plants, they would live.",
      "If I had watered my plants, they would have lived.",
      "If I water my plants, they will live."
    ],
    correctAnswer: 2,
    correctExplanation: "Correct. Third Conditional: unreal past condition.",
    incorrectExplanation: "Incorrect. This scenario describes a past event."
  }
];

const Crossroads = ({ onBackToGames }) => {
  // Initialize randomized scenarios
  const randomizedScenarios = useMemo(() => shuffleArray(scenarios), []);
  
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [randomizedOptions, setRandomizedOptions] = useState([]);
  const [score, setScore] = useState(0);

  const currentScenario = randomizedScenarios[currentScenarioIndex];

  const handleNextScenario = useCallback(() => {
    if (currentScenarioIndex < randomizedScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback('');
    } else {
      setIsGameOver(true);
      setFeedback(`Game Over! Final Score: ${score}/${randomizedScenarios.length}`);
    }
  }, [currentScenarioIndex, randomizedScenarios.length, score]);

  // Randomize options when scenario changes
  useEffect(() => {
    if (currentScenario) {
      const options = currentScenario.options.map((option, index) => ({
        text: option,
        originalIndex: index
      }));
      setRandomizedOptions(shuffleArray(options));
    }
  }, [currentScenarioIndex, currentScenario]);

  // Auto-advance timer
  useEffect(() => {
    let timer;
    if (selectedAnswer !== null && !isGameOver) {
      timer = setTimeout(handleNextScenario, 5000);
    }
    return () => clearTimeout(timer);
  }, [selectedAnswer, isGameOver, handleNextScenario]);

  const handleOptionClick = useCallback((originalIndex) => {
    console.log(`User clicked option ${String.fromCharCode(65 + originalIndex)}`);
    setSelectedAnswer(originalIndex);
    
    const isCorrect = originalIndex === currentScenario.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setFeedback(isCorrect ? currentScenario.correctExplanation : currentScenario.incorrectExplanation);
  }, [currentScenario]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <button
          onClick={onBackToGames}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          ← Back to Games
        </button>
        <h2 className="text-2xl font-bold text-blue-600">Crossroads</h2>
        <div className="text-lg font-semibold">
          Score: {score}/{randomizedScenarios.length}
        </div>
      </div>

      <ProgressBar 
        current={currentScenarioIndex} 
        total={randomizedScenarios.length} 
      />

      <CrossroadsVisual 
        selectedAnswer={selectedAnswer}
        correctAnswer={currentScenario.correctAnswer}
      />

      {/* Scenario Display */}
      <div className="mb-8 text-center w-4/5 max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <p className="text-xl mb-4 font-medium">
          {currentScenario.scenario}
        </p>
        <p className="text-lg text-gray-700">
          {currentScenario.question}
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-4 w-4/5 max-w-2xl mb-8">
        {randomizedOptions.map((option, index) => (
          <AnswerButton
            key={index}
            index={index}
            option={option.text}
            isSelected={selectedAnswer === option.originalIndex}
            isCorrect={option.originalIndex === currentScenario.correctAnswer}
            isDisabled={selectedAnswer !== null}
            onClick={() => selectedAnswer === null && handleOptionClick(option.originalIndex)}
          />
        ))}
      </div>

      {/* Feedback Area */}
      <div className={`w-4/5 max-w-2xl p-4 min-h-[60px] rounded-lg text-center mb-6
        ${isGameOver ? 'bg-blue-50 text-blue-800' : 
          feedback ? (selectedAnswer === currentScenario.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800') 
          : 'bg-gray-50'}`}>
        {feedback}
      </div>

      {selectedAnswer !== null && !isGameOver && (
        <p className="text-gray-600">
          Next scenario in 5 seconds...
        </p>
      )}
    </div>
  );
};

export default Crossroads;