import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import { getQuestionsByTopic } from './graphql/queries';
import awsconfig from './aws-exports';
import { motion } from 'framer-motion';

// Components
import StartPage from './components/StartPage';
import Games from './components/Games';
import QuestionView from './components/QuestionView';
import ResultScreen from './components/ResultScreen';

// Configure Amplify
Amplify.configure(awsconfig);
const client = generateClient();

// Grammar topics
const topics = [
    "Subject-Verb Agreement", "Verb Tenses (Basic)", "Verb Tenses (Advanced)",
    "Pronoun Agreement and Case", "Articles (a, an, the)", "Punctuation",
    "Sentence Structure (Clauses and Phrases)", "Sentence Structure (Sentence Types)",
    "Modifiers (Adjectives and Adverbs)", "Prepositions and Prepositional Phrases",
    "Conjunctions", "Word Order (Syntax)", "Active and Passive Voice",
    "Gerunds and Infinitives", "Participles", "Countable and Uncountable Nouns",
    "Determiners", "Modal Verbs", "Reported Speech (Indirect Speech)",
    "Conditional Sentences (If-Clauses)", "Phrasal Verbs"
];

// Animation variants
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

export default function App() {
    // State management
    const [view, setView] = useState('start'); // 'start', 'games', 'topics', 'questions'
    const [currentTopic, setCurrentTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);

    // Fetch questions when a topic is selected
    useEffect(() => {
        if (!currentTopic) return;

        let isMounted = true;
        const fetchQuestions = async () => {
            if (!isMounted) return;

            setLoading(true);
            setError(null);
            try {
                const response = await client.graphql({
                    query: getQuestionsByTopic,
                    variables: {
                        topic: currentTopic,
                        limit: 10
                    }
                });

                if (response.errors) {
                    throw new Error(response.errors[0].message);
                }

                const result = response.data.getQuestionsByTopic;
                if (isMounted && result && result.items) {
                    setQuestions(result.items);
                }
            } catch (err) {
                console.error('Error fetching questions:', err);
                if (isMounted) {
                    setError(err.message || 'Failed to fetch questions');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchQuestions();
        return () => {
            isMounted = false;
        };
    }, [currentTopic]);

    // Navigation handlers
    const handleShowGames = () => {
        resetQuizState();
        setView('games');
        setCurrentTopic(null);
    };

    const handleGameSelect = (game) => {
        resetQuizState();
        setView('games');
        setCurrentTopic(game);
    };

    const handleTopicSelect = (topic) => {
        if (topic === 'browseTopics') {
            setView('topics');
            setCurrentTopic(null);
        } else {
            resetQuizState();
            setCurrentTopic(topic);
            setView('questions');
        }
        setError(null);
    };

    const resetQuizState = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setScore(0);
        setShowResults(false);
        setQuestions([]);
    };

    const handleBackToStart = () => {
        setView('start');
        setCurrentTopic(null);
        setError(null);
        resetQuizState();
    };

    // Navigation within questions
    const handleAnswerSubmit = (isCorrect) => {
        const newAnswers = { ...answers };
        newAnswers[currentQuestionIndex] = isCorrect;
        setAnswers(newAnswers);
        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentQuestionIndex === questions.length - 1) {
            setShowResults(true);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleRetry = () => {
        resetQuizState();
        // Re-fetch questions for the current topic to ensure fresh start
        if (currentTopic) {
            const fetchQuestions = async () => {
                setLoading(true);
                try {
                    const response = await client.graphql({
                        query: getQuestionsByTopic,
                        variables: {
                            topic: currentTopic,
                            limit: 10
                        }
                    });
                    if (response.data.getQuestionsByTopic.items) {
                        setQuestions(response.data.getQuestionsByTopic.items);
                    }
                } catch (err) {
                    console.error('Error re-fetching questions:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchQuestions();
        }
    };

    // Render content based on current view
    const renderContent = () => {
        switch (view) {
            case 'start':
                return (
                    <StartPage
                        onShowGames={handleShowGames}
                        onTopicSelect={handleTopicSelect}
                        onGameSelect={handleGameSelect}
                    />
                );

            case 'games':
                return <Games onBackToStart={handleBackToStart} initialGame={currentTopic} />;

            case 'topics':
                if (loading) {
                    return (
                        <div className="min-h-screen flex items-center justify-center bg-white">
                            <p className="text-xl text-gray-600">Loading...</p>
                        </div>
                    );
                }

                if (error) {
                    return (
                        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
                            <p className="text-xl text-red-600 mb-4">{error}</p>
                            <button
                                onClick={handleBackToStart}
                                className="btn btn-outline mr-8"
                            >
                                Back to Start
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="min-h-screen bg-white p-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-6xl mx-auto px-8"
                        >
                            <motion.div className="flex items-center mb-8">
                                <button
                                    onClick={handleBackToStart}
                                    className="btn btn-outline mr-8"
                                >
                                    ← Back to Start
                                </button>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-7xl font-bold text-center mb-8 mx-auto
                                    font-['Inter var'] tracking-tight leading-tight
                                    bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text
                                    w-full"
                            >
                                Select a Topic
                            </motion.h1>
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                            >
                                {topics.map((topic) => (
                                    <motion.button
                                        key={topic}
                                        variants={item}
                                        onClick={() => handleTopicSelect(topic)}
                                        className="group relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg
                                            transition-all duration-200 ease-out min-h-[100px] flex flex-col items-center justify-center
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
                                        <span className="relative z-10 text-base font-medium text-gray-700 group-hover:text-white
                                            transition-colors duration-150 ease-out text-center"
                                        >
                                            {topic}
                                        </span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                );

            case 'questions':
                if (loading) {
                    return (
                        <div className="min-h-screen flex items-center justify-center bg-white">
                            <p className="text-xl text-gray-600">Loading questions...</p>
                        </div>
                    );
                }

                if (error) {
                    return (
                        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
                            <p className="text-xl text-red-600 mb-4">{error}</p>
                            <button
                                onClick={handleBackToStart}
                                className="btn btn-outline mr-8"
                            >
                                Back to Start
                            </button>
                        </div>
                    );
                }

                if (questions.length === 0) {
                    return (
                        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
                            <p className="text-xl text-gray-600 mb-4">No questions found for this topic.</p>
                            <button
                                onClick={handleBackToStart}
                                className="btn btn-outline mr-8"
                            >
                                Back to Start
                            </button>
                        </div>
                    );
                }

                if (showResults) {
                    return (
                        <ResultScreen
                            score={score}
                            totalQuestions={questions.length}
                            onRetry={handleRetry}
                            onBackToStart={handleBackToStart}
                        />
                    );
                }

                return (
                    <div className="min-h-screen bg-white">
                        <div className="max-w-4xl mx-auto p-6">
                            <div className="mb-8 flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-gray-800">{currentTopic}</h1>
                                <button
                                    onClick={handleBackToStart}
                                    className="btn btn-outline mr-8"
                                >
                                    ← Back to Start
                                </button>
                            </div>
                            
                            <QuestionView
                                question={{
                                    ...questions[currentQuestionIndex],
                                    questionId: currentQuestionIndex + 1,
                                    totalQuestions: questions.length
                                }}
                                onNext={handleNextQuestion}
                                onPrevious={currentQuestionIndex > 0 ? handlePreviousQuestion : null}
                                onAnswerSubmit={handleAnswerSubmit}
                                answers={answers}
                                currentQuestionIndex={currentQuestionIndex}
                                totalQuestions={questions.length}
                            />
                        </div>
                    </div>
                );

            default:
                return <div>Invalid view</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {renderContent()}
        </div>
    );
}
